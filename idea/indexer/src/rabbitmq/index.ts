import { Channel, connect, Connection } from 'amqplib';
import {
  AddCodeNameParams,
  AddMetaByCodeParams,
  AddMetaByProgramParams,
  AddProgramNameParams,
  AddStateParams,
  API_METHODS,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllProgramsParams,
  GetAllStateParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaByCodeParams,
  GetMetaByProgramParams,
  GetStateByCodeParams,
  GetStateParams,
  RabbitMQExchanges,
  RabbitMQueues,
} from '@gear-js/common';

import { FormResponse, logger, RabbitmqMessageParams } from '../common';
import { BlockService, CodeService, MessageService, MetaService, ProgramService, StateService } from '../services';
import config from '../config';

export class RMQService {
  private mainChannel: Channel;
  private topicChannel: Channel;
  private connection: Connection;

  constructor(
    private blockService: BlockService,
    private codeService: CodeService,
    private messageService: MessageService,
    private metaService: MetaService,
    private programService: ProgramService,
    private stateService: StateService,
  ) {}

  public async init(): Promise<void> {
    this.connection = await connect(config.rabbitmq.url);

    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      const directExchange = RabbitMQExchanges.DIRECT_EX;
      const topicExchange = RabbitMQExchanges.TOPIC_EX;
      const directExchangeType = 'direct';

      await this.mainChannel.assertExchange(directExchange, directExchangeType);
      await this.topicChannel.assertExchange(topicExchange, 'topic');

      this.connection.on('close', (error) => {
        console.log(new Date(), error);
        process.exit(1);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async deleteGenesisQueue(genesis: string) {
    const routingKey = `ds.${genesis}`;
    const messageBuff = JSON.stringify({ service: 'ds', action: 'delete', genesis });
    await this.mainChannel.unbindQueue(routingKey, RabbitMQExchanges.DIRECT_EX, routingKey);
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
  }

  public async addGenesisQueue(genesis: string) {
    const genesisQ = `ds.${genesis}`;
    await this.topicChannel.assertQueue(genesisQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });

    const topicQ = `dst.${genesis}`;
    await this.topicChannel.assertQueue(topicQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });
    await this.mainChannel.bindQueue(genesisQ, RabbitMQExchanges.DIRECT_EX, genesisQ);
    await this.topicChannel.bindQueue(topicQ, RabbitMQExchanges.TOPIC_EX, 'ds.genesises');
    await this.directMsgConsumer(genesisQ);
    await this.topicMsgConsumer(topicQ, genesis);

    const msgBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
    this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(msgBuff));
  }

  private sendMsg(exchange: RabbitMQExchanges, queue: RabbitMQueues, params: any, correlationId?: string): void {
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

  private async topicMsgConsumer(repliesAssertQueue: string, genesis): Promise<void> {
    try {
      await this.topicChannel.consume(
        repliesAssertQueue,
        async (message) => {
          if (!message) {
            return;
          }

          const messageBuff = JSON.stringify({ service: 'ds', action: 'add', genesis });
          this.mainChannel.publish(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES, Buffer.from(messageBuff));
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Topic exchange consumer ${JSON.stringify(error)}`);
    }
  }

  @FormResponse
  private async handleIncomingMsg(method: string, params: RabbitmqMessageParams): Promise<any> {
    const methods = {
      [API_METHODS.BLOCKS_STATUS]: () => this.blockService.getLastBlock(params.genesis as string),
      [API_METHODS.CODE_ALL]: () => this.codeService.getMany(params as GetAllCodeParams),
      [API_METHODS.CODE_DATA]: () => this.codeService.get(params as GetCodeParams),
      [API_METHODS.CODE_NAME_ADD]: () => this.codeService.setName(params as AddCodeNameParams),
      [API_METHODS.CODE_META_ADD]: () => this.metaService.addMetaByCode(params as AddMetaByCodeParams),
      [API_METHODS.CODE_META_GET]: () => this.codeService.getMeta(params as GetMetaByCodeParams),
      [API_METHODS.CODE_STATE_GET]: () => this.stateService.getByCodeIdAndStateId(params as GetStateByCodeParams),
      [API_METHODS.MESSAGE_ALL]: () => this.messageService.getMany(params as GetMessagesParams),
      [API_METHODS.MESSAGE_DATA]: () => this.messageService.get(params as FindMessageParams),
      [API_METHODS.PROGRAM_ALL]: () => this.programService.getAllPrograms(params as GetAllProgramsParams),
      [API_METHODS.PROGRAM_DATA]: () => this.programService.getWithMessages(params as FindProgramParams),
      [API_METHODS.PROGRAM_NAME_ADD]: () => this.programService.setName(params as AddProgramNameParams),
      [API_METHODS.PROGRAM_META_ADD]: () => this.metaService.addMetaByProgram(params as AddMetaByProgramParams),
      [API_METHODS.PROGRAM_META_GET]: () => this.programService.getMeta(params as GetMetaByProgramParams),
      [API_METHODS.PROGRAM_STATE_ALL]: () => this.stateService.listByProgramId(params as GetAllStateParams),
      [API_METHODS.PROGRAM_STATE_ADD]: () => this.stateService.create(params as AddStateParams),
      [API_METHODS.PROGRAM_STATE_GET]: () => this.stateService.get(params as GetStateParams),
      [API_METHODS.STATE_GET]: () => this.stateService.get(params as GetStateParams),
    };

    return methods[method]();
  }
}
