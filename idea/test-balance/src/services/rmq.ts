import { logger, RMQExchange, RMQQueue, RMQServiceAction, RMQServices, TEST_BALANCE_METHODS } from '@gear-js/common';
import { Channel, connect, Connection } from 'amqplib';
import { randomUUID } from 'node:crypto';

import config from '../config';
import { TransferService } from './transfer';
import { GearService } from './gear';

export class RMQService {
  private connection: Connection;
  private mainChannel: Channel;

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

    const genesis = this.gearService.genesisHash;

    const routingKey = `${RMQServices.TEST_BALANCE}.${genesis}`;

    await this.mainChannel.assertExchange(RMQExchange.DIRECT_EX, 'direct');
    await this.mainChannel.assertExchange(RMQExchange.GENESISES, 'fanout');

    await this.mainChannel.assertQueue(routingKey, {
      durable: false,
      autoDelete: false,
      exclusive: false,
    });
    await this.mainChannel.bindQueue(routingKey, RMQExchange.DIRECT_EX, routingKey);

    await this.directMessageConsumer(routingKey);
    await this.genesisesQSetup();

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

  private async genesisesQSetup(): Promise<void> {
    const qName = RMQQueue.GENESISES_REQUEST;

    await this.mainChannel.assertQueue('', {
      exclusive: true,
      autoDelete: true,
    });

    await this.mainChannel.bindQueue('', RMQExchange.GENESISES, '');

    try {
      await this.mainChannel.consume(
        '',
        async (message) => {
          if (!message) {
            return;
          }

          logger.info('Genesis request');
          if (this.gearService.genesisHash !== null) {
            this.sendGenesis(this.gearService.genesisHash);
          }
        },
        { noAck: true },
      );
    } catch (error) {
      logger.error('Topic exchange consumer error.', { error });
    }
  }

  sendGenesis(genesis: string): void {
    const correlationId = randomUUID();
    const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis });
    logger.info('Send genesis', { genesis, correlationId });
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESIS, Buffer.from(messageBuff), {
      headers: { correlationId },
    });
  }

  sendDeleteGenesis(genesis: string): void {
    const messageBuff = JSON.stringify({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.DELETE, genesis });
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.GENESIS, Buffer.from(messageBuff));
  }

  sendReply(correlationId: string, params: any): void {
    const messageBuff = JSON.stringify(params);
    this.mainChannel.publish(RMQExchange.DIRECT_EX, RMQQueue.REPLIES, Buffer.from(messageBuff), {
      correlationId,
    });
  }
}
