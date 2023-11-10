import { logger, RMQExchange, RMQQueue, RMQServiceAction, RMQServices, TEST_BALANCE_METHODS } from '@gear-js/common';
import { Channel, connect, Connection } from 'amqplib';

import config from '../config';
import { TransferService } from './transfer';
import { GearService } from './gear';

export class RMQService {
  private connection: Connection;
  private mainChannel: Channel;
  private topicChannel: Channel;

  constructor(private transferService: TransferService, private gearService: GearService) {}

  async init() {
    try {
      this.connection = await connect(config.rabbitmq.url);
    } catch (error) {
      logger.error('RabbitMQ connection error', { error: error.message, stack: error.stack });
      process.exit(1);
    }

    this.connection.on('close', (error) => {
      logger.error('RabbitMQ connection closed', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    this.mainChannel = await this.connection.createChannel();
    this.topicChannel = await this.connection.createChannel();

    const directExchange = RMQExchange.DIRECT_EX;
    const topicExchange = RMQExchange.TOPIC_EX;
    const genesis = this.gearService.genesisHash;

    const routingKey = `${RMQServices.TEST_BALANCE}.${genesis}`;

    await this.mainChannel.assertExchange(directExchange, 'direct');
    await this.mainChannel.assertExchange(topicExchange, 'topic');

    const assertTopicQueue = await this.topicChannel.assertQueue(`${RMQServices.TEST_BALANCE}t.${genesis}`, {
      durable: false,
      autoDelete: true,
      exclusive: false,
    });
    await this.mainChannel.assertQueue(routingKey, {
      durable: false,
      autoDelete: false,
      exclusive: false,
    });
    await this.mainChannel.bindQueue(routingKey, directExchange, routingKey);
    await this.mainChannel.bindQueue(assertTopicQueue.queue, topicExchange, `${RMQServices.TEST_BALANCE}.genesises`);

    await this.directMessageConsumer(routingKey);
    await this.topicMessageConsumer(assertTopicQueue.queue);

    this.sendGenesis(this.gearService.genesisHash);
  }

  async directMessageConsumer(queue: string): Promise<void> {
    try {
      await this.mainChannel.consume(
        queue,
        async ({ content, properties: { headers, correlationId } }) => {
          const payload = JSON.parse(content.toString());
          const method = headers.method;

          if (method === TEST_BALANCE_METHODS.TEST_BALANCE_GET && payload.genesis === this.gearService.genesisHash) {
            logger.info('New balance request', { addr: payload.address, correlationId });
            const result = await this.transferService.transferBalance(payload, correlationId);
            this.sendReply(correlationId, result);
          }
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Direct exchange consumer error`, { error });
    }
  }

  async topicMessageConsumer(queue: string): Promise<void> {
    try {
      await this.topicChannel.consume(
        queue,
        async (message) => {
          if (!message) {
            return;
          }
          if (this.gearService.genesisHash !== null) {
            this.sendGenesis(this.gearService.genesisHash);
          }
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Topic exchange consumer error`, { error: error.message });
    }
  }

  sendGenesis(genesis: string): void {
    const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis });
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
  }

  sendDeleteGenesis(genesis: string): void {
    const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.DELETE, genesis });
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESISES, Buffer.from(messageBuff));
  }

  sendReply(correlationId: string, params: any): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.REPLIES, Buffer.from(messageBuff), {
      correlationId,
    });
  }
}
