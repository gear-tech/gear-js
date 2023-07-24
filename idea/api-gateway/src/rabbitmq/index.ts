import { CronJob } from 'cron';
import { connect, Connection, Channel } from 'amqplib';
import {
  RMQMessage,
  RMQReply,
  RMQServiceActions,
  RMQServices,
  RabbitMQExchanges,
  RabbitMQueues,
} from '@gear-js/common';

import config from '../config';
import { logger } from '../common/logger';

export class RMQService {
  private indexerChannels: Map<string, Channel>;
  private tbChannels: Map<string, Channel>;
  public replies: Map<string, (params: any) => RMQReply>;
  private metaChannel: Channel;
  private connection: Connection;
  private mainChannel: Channel;

  constructor() {
    this.indexerChannels = new Map<string, Channel>();
    this.tbChannels = new Map<string, Channel>();
    this.replies = new Map<string, (params: any) => RMQReply>();
  }

  public async init(): Promise<void> {
    try {
      this.connection = await connect(config.rabbitmq.url);
    } catch (err) {
      logger.error('Failed to connecto to RabbitMQ');
      console.log(err);
      process.exit(1);
    }

    this.mainChannel = await this.connection.createChannel();
    await this.mainChannel.assertExchange(RabbitMQExchanges.TOPIC_EX, 'topic', { durable: true });
    await this.mainChannel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
    await this.mainChannel.assertQueue(RabbitMQueues.REPLIES, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000,
    });

    await this.mainChannel.bindQueue(RabbitMQueues.REPLIES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES);

    await this.mainChannel.assertQueue(RabbitMQueues.GENESISES, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      messageTtl: 30_000,
    });

    await this.mainChannel.bindQueue(RabbitMQueues.GENESISES, RabbitMQExchanges.DIRECT_EX, RabbitMQueues.GENESISES);

    this.metaChannel = await this.connection.createChannel();
    this.metaChannel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });

    await this.subscribeToGenesises();
    await this.subscribeToReplies();
  }

  private async subscribeToReplies(): Promise<void> {
    await this.mainChannel.consume(
      RabbitMQueues.REPLIES,
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
      RabbitMQueues.GENESISES,
      async (message) => {
        if (!message) {
          return;
        }

        const { genesis, service, action } = JSON.parse(message.content.toString());

        if (action === RMQServiceActions.ADD) {
          if (service === RMQServices.INDEXER) {
            if (this.indexerChannels.has(genesis)) return;

            const channel = await this.createChannel();
            this.indexerChannels.set(genesis, channel);
            await channel.assertQueue(`${RMQServices.INDEXER}.${genesis}`, {
              durable: false,
              exclusive: false,
              autoDelete: true,
            });

            logger.info(`Indexer: Add new genesis ${genesis}`);
            logger.info(`Indexer genesises: ${JSON.stringify(Array.from(this.indexerChannels.keys()), undefined, 2)}`);
          }
          if (service === RMQServices.TEST_BALANCE) {
            if (this.tbChannels.has(genesis)) return;

            const channel = await this.createChannel();
            this.tbChannels.set(genesis, channel);
            await channel.assertQueue(`${RMQServices.TEST_BALANCE}.${genesis}`, { durable: false, exclusive: false });
            logger.info(`TB: Add new genesis ${genesis}`);
            logger.info(`TB genesises: ${JSON.stringify(Array.from(this.tbChannels.keys()), undefined, 2)}`);
          }
        }

        if (action === RMQServiceActions.DELETE) {
          if (service === RMQServices.INDEXER) {
            const channel = this.indexerChannels.get(genesis);
            if (channel) {
              await channel.close();
              this.indexerChannels.delete(genesis);
              logger.info(`Indexer: Delete genesis ${genesis}`);
              logger.info(
                `Indexer genesises: ${JSON.stringify(Array.from(this.indexerChannels.keys()), undefined, 2)}`,
              );
            }
          }
          if (service === RMQServices.TEST_BALANCE) {
            const channel = this.tbChannels.get(genesis);
            if (channel) {
              await channel.close();
              this.tbChannels.delete(genesis);
              logger.info(`TB: Delete new genesis ${genesis}`);
              logger.info(`TB genesises: ${JSON.stringify(Array.from(this.tbChannels.keys()), undefined, 2)}`);
            }
          }
        }
      },
      { noAck: true },
    );
  }

  private async createChannel() {
    const channel = await this.connection.createChannel();
    channel.assertExchange(RabbitMQExchanges.DIRECT_EX, 'direct', { durable: true });
    return channel;
  }

  public sendMsgToIndexer({ genesis, params, correlationId, method }: RMQMessage) {
    const channel = this.indexerChannels.get(genesis);

    channel.publish(
      RabbitMQExchanges.DIRECT_EX,
      `${RMQServices.INDEXER}.${genesis}`,
      Buffer.from(JSON.stringify(params)),
      {
        correlationId,
        headers: { method },
      },
    );
  }

  public sendMsgToMetaStorage({ params, correlationId, method }: RMQMessage) {
    this.metaChannel.publish(
      RabbitMQExchanges.DIRECT_EX,
      RMQServices.META_STORAGE,
      Buffer.from(JSON.stringify(params)),
      {
        correlationId,
        headers: { method },
      },
    );
  }

  public sendMsgToTestBalance({ genesis, params, correlationId, method }: RMQMessage) {
    const channel = this.tbChannels.get(genesis);

    channel.publish(
      RabbitMQExchanges.DIRECT_EX,
      `${RMQServices.TEST_BALANCE}.${genesis}`,
      Buffer.from(JSON.stringify(params)),
      {
        correlationId,
        headers: { method },
      },
    );
  }

  public sendMsgIndexerGenesises() {
    this.mainChannel.publish(RabbitMQExchanges.TOPIC_EX, `${RMQServices.INDEXER}.genesises`, Buffer.from(''));
  }

  public sendMsgTBGenesises() {
    this.mainChannel.publish(RabbitMQExchanges.TOPIC_EX, `${RMQServices.TEST_BALANCE}.genesises`, Buffer.from(''));
  }

  public isExistTBChannel(genesis: string) {
    return this.tbChannels.has(genesis);
  }

  public isExistIndexerChannel(genesis: string) {
    return this.indexerChannels.has(genesis);
  }

  public async runScheduler() {
    this.sendMsgTBGenesises();
    this.sendMsgIndexerGenesises();

    const cronTime = config.scheduler.genesisHashesTime;

    const cron = new CronJob(cronTime, async () => {
      this.tbChannels.clear();
      this.indexerChannels.clear();

      await this.sendMsgIndexerGenesises();
      await this.sendMsgTBGenesises();
    });

    cron.start();
  }
}
