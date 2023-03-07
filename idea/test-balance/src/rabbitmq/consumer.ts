import { Channel, Replies } from 'amqplib';
import { AMQP_METHODS } from '@gear-js/common';

import { producer } from './producer';
import { gearService } from '../gear';
import { requests } from '../common/transfer-balance-process';

export async function directMessageConsumer(channel: Channel, queue: string): Promise<void> {
  try {
    await channel.consume(
      queue,
      async (message) => {
        const payload = JSON.parse(message.content.toString());
        const method = message.properties.headers.method;
        const correlationId = message.properties.correlationId;

        if (method === AMQP_METHODS.TEST_BALANCE_GET && payload.genesis === gearService.getGenesisHash()) {
          requests.push({ payload, correlationId });
        }
      },
      { noAck: true },
    );
  } catch (error) {
    console.error(`${new Date()} | Direct exchange consumer error`, error);
  }
}

export async function topicMessageConsumer(channel: Channel, repliesAssertQueue: Replies.AssertQueue): Promise<void> {
  try {
    await channel.consume(
      repliesAssertQueue.queue,
      async (message) => {
        if (!message) {
          return;
        }

        producer.sendGenesis(gearService.getGenesisHash());
      },
      { noAck: true },
    );
  } catch (error) {
    this.logger.error(new Date());
    this.logger.error(`${new Date()} | Topic exchange consumer error ${JSON.stringify(error)}`);
  }
}
