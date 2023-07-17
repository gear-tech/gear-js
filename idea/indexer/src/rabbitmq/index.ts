import { Channel, connect, Connection } from 'amqplib';
import {
  AddCodeNameParams,
  AddProgramNameParams,
  AddStateParams,
  INDEXER_METHODS,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetAllStateParams,
  GetCodeParams,
  GetMessagesParams,
  GetStateByCodeParams,
  GetStateParams,
  RabbitMQExchanges,
  RabbitMQueues,
  RMQServiceActions,
  RMQServices,
  FormResponse,
} from '@gear-js/common';

import { logger } from '../common';
import { BlockService, CodeService, MessageService, ProgramService, StateService } from '../services';
import config from '../config';

export class RMQService {
  private mainChannel: Channel;
  private topicChannel: Channel;
  private connection: Connection;

  constructor(
    private blockService?: BlockService,
    private codeService?: CodeService,
    private messageService?: MessageService,
    private programService?: ProgramService,
    private stateService?: StateService,
  ) {}

  public async init(consumeMessages = true): Promise<void> {
    this.connection = await connect(config.rabbitmq.url);

    this.connection.on('close', (error) => {
      console.log(new Date(), error);
      process.exit(1);
    });

    if (!consumeMessages) {
      return;
    }

    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const topicExchange = RabbitMQExchanges.TOPIC_EX;
      const directExchangeType = 'direct';

      await this.mainChannel.assertExchange(directExchange, directExchangeType);
      await this.topicChannel.assertExchange(topicExchange, 'topic');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async deleteGenesisQueue(genesis: string) {
    const routingKey = `${RMQServices.INDEXER}.${genesis}`;
    const messageBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceActions.DELETE, genesis });
    await this.mainChannel.unbindQueue(routingKey, RabbitMQExchanges.DIRECT_EX, routingKey);
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
  }

  public async addGenesisQueue(genesis: string) {
    const genesisQ = `${RMQServices.INDEXER}.${genesis}`;
    await this.topicChannel.assertQueue(genesisQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });

    const topicQ = `${RMQServices.INDEXER}t.${genesis}`;
    await this.topicChannel.assertQueue(topicQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });
    await this.mainChannel.bindQueue(genesisQ, RabbitMQExchanges.DIRECT_EX, genesisQ);
    await this.topicChannel.bindQueue(topicQ, RabbitMQExchanges.TOPIC_EX, `${RMQServices.INDEXER}.genesises`);
    await this.directMsgConsumer(genesisQ);
    await this.topicMsgConsumer(topicQ, genesis);

    const msgBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceActions.ADD, genesis });
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(msgBuff));
  }

  private sendMsg(exchange: string, queue: string, params: any, correlationId?: string): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId });
  }

  private async directMsgConsumer(queue: string): Promise<void> {
    try {
      await this.mainChannel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }
          const method = message.properties.headers.method;

          const params = JSON.parse(message.content.toString());
          const correlationId = message.properties.correlationId;

          const result = await this.handleIncomingMsg(method, params);

          this.sendMsg(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, result, correlationId);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Direct exchange consumer ${JSON.stringify(error)}`);
    }
  }

  private async topicMsgConsumer(queue: string, genesis: string): Promise<void> {
    try {
      await this.topicChannel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }

          const messageBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceActions.ADD, genesis });
          this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Topic exchange consumer ${JSON.stringify(error)}`);
    }
  }

  @FormResponse
  private async handleIncomingMsg(method: INDEXER_METHODS, params: any): Promise<any> {
    const methods = {
      [INDEXER_METHODS.BLOCKS_STATUS]: () => this.blockService.getLastBlock(params.genesis as string),
      [INDEXER_METHODS.CODE_ALL]: () => this.codeService.getMany(params as GetAllCodeParams),
      [INDEXER_METHODS.CODE_DATA]: () => this.codeService.get(params as GetCodeParams),
      [INDEXER_METHODS.CODE_NAME_ADD]: () => this.codeService.setName(params as AddCodeNameParams),
      [INDEXER_METHODS.CODE_STATE_GET]: () => this.stateService.getByCodeIdAndStateId(params as GetStateByCodeParams),
      [INDEXER_METHODS.MESSAGE_ALL]: () => this.messageService.getMany(params as GetMessagesParams),
      [INDEXER_METHODS.MESSAGE_DATA]: () => this.messageService.get(params as FindMessageParams),
      [INDEXER_METHODS.PROGRAM_ALL]: () => this.programService.getAllPrograms(params as GetAllProgramsParams),
      [INDEXER_METHODS.PROGRAM_DATA]: () => this.programService.getWithMessages(params as FindProgramParams),
      [INDEXER_METHODS.PROGRAM_NAME_ADD]: () => this.programService.setName(params as AddProgramNameParams),
      [INDEXER_METHODS.PROGRAM_STATE_ALL]: () => this.stateService.listByProgramId(params as GetAllStateParams),
      [INDEXER_METHODS.PROGRAM_STATE_ADD]: () => this.stateService.create(params as AddStateParams),
      [INDEXER_METHODS.PROGRAM_STATE_GET]: () => this.stateService.get(params as GetStateParams),
      [INDEXER_METHODS.STATE_GET]: () => this.stateService.get(params as GetStateParams),
    };

    return methods[method]();
  }

  public async sendMsgToMetaStorage(metahashes: Map<string, Set<string>>) {
    const msg = Array.from(metahashes.entries()).map(([key, value]) => [key, Array.from(value.values())]);
    return this.sendMsg(RabbitMQExchanges.DIRECT_EX, RMQServices.META_STORAGE, msg);
  }
}
