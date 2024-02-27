import { Channel, connect, Connection } from 'amqplib';
import {
  INDEXER_METHODS,
  RMQServiceAction,
  RMQServices,
  FormResponse,
  META_STORAGE_INTERNAL_METHODS,
  RMQExchange,
  RMQQueue,
  INDEXER_INTERNAL_METHODS,
  logger,
} from '@gear-js/common';

import { BlockService, CodeService, MessageService, ProgramService, StateService } from './services';
import config from './config';

export class RMQService {
  private mainChannel: Channel;
  private topicChannel: Channel;
  private connection: Connection;
  private methods: Record<INDEXER_METHODS | INDEXER_INTERNAL_METHODS, (params: any) => void>;

  constructor(
    private blockService?: BlockService,
    private codeService?: CodeService,
    private messageService?: MessageService,
    private programService?: ProgramService,
    private stateService?: StateService,
    private oneTimeSync = false,
  ) {
    if (this.oneTimeSync) return;
    this.methods = {
      [INDEXER_METHODS.BLOCKS_STATUS]: this.blockService.getLastBlock.bind(this.blockService),
      [INDEXER_METHODS.CODE_ALL]: this.codeService.getMany.bind(this.codeService),
      [INDEXER_METHODS.CODE_DATA]: this.codeService.get.bind(this.codeService),
      [INDEXER_METHODS.CODE_NAME_ADD]: this.codeService.setName.bind(this.codeService),
      [INDEXER_METHODS.MESSAGE_ALL]: this.messageService.getMany.bind(this.messageService),
      [INDEXER_METHODS.MESSAGE_DATA]: this.messageService.get.bind(this.messageService),
      [INDEXER_METHODS.PROGRAM_ALL]: this.programService.getAllPrograms.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_DATA]: this.programService.get.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_NAME_ADD]: this.programService.setName.bind(this.programService),
      [INDEXER_METHODS.PROGRAM_STATE_ALL]: this.stateService.listByProgramId.bind(this.stateService),
      [INDEXER_METHODS.PROGRAM_STATE_ADD]: this.stateService.create.bind(this.stateService),
      [INDEXER_METHODS.STATE_GET]: this.stateService.get.bind(this.stateService),
      [INDEXER_INTERNAL_METHODS.META_HAS_STATE]: async (hashes: string[]) =>
        Promise.all([this.programService.hasState(hashes), this.codeService.hasState(hashes)]),
    };
  }

  public async init(consumeMessages = true): Promise<void> {
    this.connection = await connect(config.rabbitmq.url);

    this.connection.on('close', (error) => {
      logger.error('RabbitMQ connection lost', { error });
      process.exit(1);
    });

    if (!consumeMessages) {
      return;
    }

    try {
      this.mainChannel = await this.connection.createChannel();
      this.topicChannel = await this.connection.createChannel();

      await this.mainChannel.assertExchange(RMQExchange.DIRECT_EX, 'direct');
      await this.topicChannel.assertExchange(RMQExchange.TOPIC_EX, 'topic');

      await this.mainChannel.assertExchange('INDXR_META', 'fanout', { autoDelete: true });
      await this.mainChannel.assertQueue('', {
        durable: true,
        exclusive: false,
        autoDelete: false,
      });
      await this.mainChannel.bindQueue('', 'INDXR_META', '');
      this.metaMsgConsumer();
    } catch (error) {
      logger.error('Failed to setup rabbitmq exchanges', { error });
      throw error;
    }
  }

  public async deleteGenesisQueue(genesis: string) {
    const routingKey = `${RMQServices.INDEXER}.${genesis}`;
    const messageBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceAction.DELETE, genesis });
    await this.mainChannel.unbindQueue(routingKey, RMQExchange.DIRECT_EX, routingKey);
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
  }

  public async addGenesisQueue(genesis: string) {
    const genesisQ = `${RMQServices.INDEXER}.${genesis}`;
    await this.topicChannel.assertQueue(genesisQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });
    await this.mainChannel.bindQueue(genesisQ, RMQExchange.DIRECT_EX, genesisQ);

    const topicQ = `${RMQServices.INDEXER}t.${genesis}`;
    await this.topicChannel.assertQueue(topicQ, {
      durable: false,
      exclusive: false,
      autoDelete: true,
    });
    await this.topicChannel.bindQueue(topicQ, RMQExchange.TOPIC_EX, `${RMQServices.INDEXER}.genesises`);

    await this.directMsgConsumer(genesisQ);
    await this.genesisesMsgConsumer(topicQ, genesis);

    const msgBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceAction.ADD, genesis });
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(msgBuff));
  }

  private sendMsg(exchange: string, queue: string, params: any, correlationId?: string, method?: string): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), { correlationId, headers: { method } });
  }

  private async metaMsgConsumer(): Promise<void> {
    const exchange = 'indxr_meta';
    const channel = await this.connection.createChannel();
    await channel.assertExchange(exchange, 'fanout', { autoDelete: true });
    const q = await channel.assertQueue('', { exclusive: false });
    await channel.bindQueue(q.queue, exchange, '');

    try {
      await channel.consume(
        q.queue,
        async (msg) => {
          if (!msg) {
            return;
          }

          const { method } = msg.properties.headers;
          const params = JSON.parse(msg.content.toString());
          await this.handleIncomingMsg(method, params);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error('Meta message consumer error', { error });
    }
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

          this.sendMsg(RMQExchange.DIRECT_EX, RMQQueue.REPLIES, result, correlationId);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error('Direct exchange consumer error.', { error });
    }
  }

  private async genesisesMsgConsumer(queue: string, genesis: string): Promise<void> {
    try {
      await this.topicChannel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }

          const messageBuff = JSON.stringify({ service: RMQServices.INDEXER, action: RMQServiceAction.ADD, genesis });
          this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error('Topic exchange consumer error.', { error });
    }
  }

  @FormResponse
  private async handleIncomingMsg(method: INDEXER_METHODS, params: any): Promise<any> {
    return this.methods[method](params);
  }

  public sendMetahashToMetaStorage(metahash: string, codeId: string) {
    this.sendMsg(
      RMQExchange.DIRECT_EX,
      RMQServices.META_STORAGE,
      { metahash, codeId },
      null,
      META_STORAGE_INTERNAL_METHODS.META_HASH_ADD,
    );
  }
}
