import { Channel, connect, Connection, Replies } from 'amqplib';
import { logger, RMQExchange, RMQQueue, RMQServiceAction, RMQServices, TEST_BALANCE_METHODS } from '@gear-js/common';

import config from './config';
import { transferService } from './transfer.service';
import { requests } from './transfer-balance-process';

export class RMQService {
  private connection: Connection;
  private mainChannel: Channel;
  private topicChannel: Channel;

  async init() {
    try {
      this.connection = await connect(config.rabbitmq.url);
    } catch (error) {
      logger.error('RabbitMQ connection error', { error });
    }

    this.connection.on('close', (error) => {
      logger.error('RabbitMQ connection closed', { error });
      process.exit(1);
    });

    this.mainChannel = await this.connection.createChannel();
    this.topicChannel = await this.connection.createChannel();
    const directExchange = RMQExchange.DIRECT_EX;
    const topicExchange = RMQExchange.TOPIC_EX;
    const genesis = transferService.genesisHash;
    const directExchangeType = 'direct';
    const topicExchangeType = 'topic';
    const routingKey = `${RMQServices.TEST_BALANCE}.${genesis}`;

    //send genesis
    const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis });
    this.mainChannel.publish(directExchange, RMQQueue.GENESISES, Buffer.from(messageBuff));

    await this.mainChannel.assertExchange(directExchange, directExchangeType);
    await this.mainChannel.assertExchange(topicExchange, topicExchangeType);

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
    await this.topicMessageConsumer(assertTopicQueue);
  }

  async directMessageConsumer(queue: string): Promise<void> {
    try {
      await this.mainChannel.consume(
        queue,
        async (message) => {
          const payload = JSON.parse(message.content.toString());
          const method = message.properties.headers.method;
          const correlationId = message.properties.correlationId;

          if (method === TEST_BALANCE_METHODS.TEST_BALANCE_GET && payload.genesis === transferService.genesisHash) {
            requests.push({ payload, correlationId });
          }
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Direct exchange consumer error`, { error });
    }
  }

  async topicMessageConsumer(repliesAssertQueue: Replies.AssertQueue): Promise<void> {
    try {
      await this.topicChannel.consume(
        repliesAssertQueue.queue,
        async (message) => {
          if (!message) {
            return;
          }

          this.sendGenesis(transferService.genesisHash);
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error(`Topic exchange consumer error`, { error });
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

  sendMessage(exchange: RMQExchange, queue: RMQQueue, correlationId: string, params: any): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(exchange, queue, Buffer.from(messageBuff), {
      correlationId,
    });
  }
}

export const rmqService = new RMQService();
