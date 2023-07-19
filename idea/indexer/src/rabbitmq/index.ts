import { Channel, connect, Connection } from 'amqplib';
import {
  INDEXER_METHODS,
  RabbitMQExchanges,
  RabbitMQueues,
  RMQServiceActions,
  RMQServices,
  FormResponse,
  META_STORAGE_INTERNAL_METHODS,
} from '@gear-js/common';

import { logger } from '../common';
import { BlockService, CodeService, MessageService, ProgramService, StateService } from '../services';
import config from '../config';

export class RMQService {
  private mainChannel: Channel;
  private topicChannel: Channel;
  private connection: Connection;
  private methods: Record<INDEXER_METHODS, (params: any) => void>;

  constructor(
    private blockService?: BlockService,
    private codeService?: CodeService,
    private messageService?: MessageService,
    private programService?: ProgramService,
    private stateService?: StateService,
  ) {
    this.methods = {
      [INDEXER_METHODS.BLOCKS_STATUS]: () => this.blockService.getLastBlock.bind(this.blockService),
      [INDEXER_METHODS.CODE_ALL]: () => this.codeService.getMany.bind(this.codeService),
      [INDEXER_METHODS.CODE_DATA]: () => this.codeService.get.bind(this.codeService),
      [INDEXER_METHODS.CODE_NAME_ADD]: () => this.codeService.setName.bind(this.codeService),
      [INDEXER_METHODS.CODE_STATE_GET]: () => this.stateService.getByCodeIdAndStateId.bind(this.stateService),
      [INDEXER_METHODS.MESSAGE_ALL]: () => this.messageService.getMany.bind(this.messageService),
      [INDEXER_METHODS.MESSAGE_DATA]: () => this.messageService.get.bind(this.messageService),
      [INDEXER_METHODS.PROGRAM_ALL]: () => this.programService.getAllPrograms.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_DATA]: () => this.programService.getWithMessages.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_NAME_ADD]: () => this.programService.setName.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_STATE_ALL]: () => this.stateService.listByProgramId.bind(this.stateService),
      [INDEXER_METHODS.PROGRAM_STATE_ADD]: () => this.stateService.create.bind(this.stateService),
      [INDEXER_METHODS.STATE_GET]: () => this.stateService.get.bind(this.stateService),
    };
  }

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

  private sendMsg(exchange: string, queue: string, params: any, correlationId?: string, method?: string): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId, headers: { method } });
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
    return this.methods[method](params);
  }

  public async sendMsgToMetaStorage(metahashes: Map<string, Set<string>>) {
    const msg = Array.from(metahashes.entries()).map(([key, value]) => [key, Array.from(value.values())]);
    return this.sendMsg(
      RabbitMQExchanges.DIRECT_EX,
      RMQServices.META_STORAGE,
      msg,
      null,
      META_STORAGE_INTERNAL_METHODS.META_HASH_ADD,
    );
  }
}
