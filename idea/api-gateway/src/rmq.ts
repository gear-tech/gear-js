import { CronJob } from 'cron';
import { connect, Connection, Channel } from 'amqplib';
import { logger, RMQExchange, RMQMessage, RMQQueue, RMQReply, RMQServiceAction, RMQServices } from '@gear-js/common';

import config from './config';

export class RMQService {
  private indexerChannels: Map<string, Channel>;
  private tbChannels: Map<string, Channel>;
  public replies: Map<string, (params: any) => RMQReply>;
  private connection: Connection;
  private metaChannel: Channel;
  private mainChannel: Channel;

  constructor() {
    this.indexerChannels = new Map<string, Channel>();
    this.tbChannels = new Map<string, Channel>();
    this.replies = new Map<string, (params: any) => RMQReply>();
  }

  public async init(): Promise<void> {
    try {
      this.connection = await connect(config.rabbitmq.url);

      logger.info('RabbitMQ connection established sucessfuly', { url: config.rabbitmq.url });
    } catch (error) {
      logger.error('Failed to connect to to RabbitMQ', { error });
      process.exit(1);
    }

    this.mainChannel = await this.connection.createChannel();
    await this.mainChannel.assertExchange(RMQExchange.GENESISES, 'fanout', { durable: true });
    await this.mainChannel.assertExchange(RMQExchange.DIRECT_EX, 'direct', { durable: true });
    await this.mainChannel.assertQueue(RMQQueue.REPLIES, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000,
    });

    await this.mainChannel.bindQueue(RMQQueue.REPLIES, RMQExchange.DIRECT_EX, RMQQueue.REPLIES);

    await this.mainChannel.assertQueue(RMQQueue.GENESIS, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000,
    });

    await this.mainChannel.bindQueue(RMQQueue.GENESIS, RMQExchange.DIRECT_EX, RMQQueue.GENESIS);

    this.metaChannel = await this.connection.createChannel();
    this.metaChannel.assertExchange(RMQExchange.DIRECT_EX, 'direct', { durable: true });

    await this.subscribeToGenesises();
    await this.subscribeToReplies();
  }

  private async subscribeToReplies(): Promise<void> {
    await this.mainChannel.consume(
      RMQQueue.REPLIES,
      (message) => {
        if (!message) {
          return;
        }

        const messageContent = JSON.parse(message.content.toString());
        const correlationId = message.properties.correlationId;
        const resultFromService = this.replies.get(correlationId);

        if (resultFromService) resultFromService(messageContent);

        this.replies.delete(correlationId);
      },
      { noAck: true },
    );
  }

  private async subscribeToGenesises() {
    await this.mainChannel.consume(
      RMQQueue.GENESIS,
      async (message) => {
        if (!message) {
          return;
        }

        const { genesis, service, action } = JSON.parse(message.content.toString());
        logger.info(RMQQueue.GENESIS, { genesis, service, action });

        switch (service) {
          case RMQServices.INDEXER: {
            if (action === RMQServiceAction.ADD) {
              if (this.indexerChannels.has(genesis)) return;

              const channel = await this.createChannel();
              this.indexerChannels.set(genesis, channel);
              await channel.assertQueue(`${RMQServices.INDEXER}.${genesis}`, {
                durable: false,
                exclusive: false,
                autoDelete: true,
              });
            } else if (action === RMQServiceAction.DELETE) {
              const channel = this.indexerChannels.get(genesis);
              if (channel) {
                await channel.close();
                this.indexerChannels.delete(genesis);
              }
            }
            break;
          }
          case RMQServices.TEST_BALANCE: {
            if (action === RMQServiceAction.ADD) {
              if (this.tbChannels.has(genesis)) return;

              const channel = await this.createChannel();
              this.tbChannels.set(genesis, channel);
              await channel.assertQueue(`${RMQServices.TEST_BALANCE}.${genesis}`, { durable: false, exclusive: false });
            } else if (action === RMQServiceAction.DELETE) {
              const channel = this.tbChannels.get(genesis);
              if (channel) {
                await channel.close();
                this.tbChannels.delete(genesis);
              }
            }
            break;
          }
          default: {
            logger.error('Unknown service', { service, genesis, action });
          }
        }

        logger.info(
          'Genesises updated',
          service === RMQServices.INDEXER
            ? { indexer: Array.from(this.indexerChannels.keys()) }
            : { tb: Array.from(this.tbChannels.keys()) },
        );
      },
      { noAck: true },
    );
  }

  private async createChannel() {
    const channel = await this.connection.createChannel();
    channel.assertExchange(RMQExchange.DIRECT_EX, 'direct', { durable: true });
    return channel;
  }

  public sendMsgToIndexer({ genesis, params, correlationId, method }: RMQMessage) {
    const channel = this.indexerChannels.get(genesis);

    channel.publish(RMQExchange.DIRECT_EX, `${RMQServices.INDEXER}.${genesis}`, Buffer.from(JSON.stringify(params)), {
      correlationId,
      headers: { method },
    });
  }

  public sendMsgToMetaStorage({ params, correlationId, method }: RMQMessage) {
    this.metaChannel.publish(RMQExchange.DIRECT_EX, RMQServices.META_STORAGE, Buffer.from(JSON.stringify(params)), {
      correlationId,
      headers: { method },
    });
  }

  public sendMsgToTestBalance({ genesis, params, correlationId, method }: RMQMessage) {
    const channel = this.tbChannels.get(genesis);

    channel.publish(
      RMQExchange.DIRECT_EX,
      `${RMQServices.TEST_BALANCE}.${genesis}`,
      Buffer.from(JSON.stringify(params)),
      {
        correlationId,
        headers: { method },
      },
    );
  }

  public requestActiveGenesises() {
    this.mainChannel.publish(RMQExchange.GENESISES, '', Buffer.from(''));
    logger.info(`Genesises request sent`);
  }

  public isExistTBChannel(genesis: string) {
    return this.tbChannels.has(genesis);
  }

  public isExistIndexerChannel(genesis: string) {
    return this.indexerChannels.has(genesis);
  }

  public async runScheduler() {
    const cronTime = config.scheduler.genesisHashesTime;

    new CronJob(
      cronTime,
      async () => {
        this.tbChannels.clear();
        this.indexerChannels.clear();

        this.requestActiveGenesises();
      },
      null,
      true,
      null,
      null,
      true,
    );
  }
}
