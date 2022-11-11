import { Channel, Replies } from 'amqplib';
import { KAFKA_TOPICS, RabbitMQueues } from '@gear-js/common';

import { producer } from './producer';
import { gearService } from '../gear';
import { transferBalanceProcess } from '../common/transfer-balance-process';

export async function directExchangeConsumer(channel: Channel, repliesAssertQueue: Replies.AssertQueue): Promise<void> {
  try {
    await channel.consume(repliesAssertQueue.queue, async (message) => {
      const payload = JSON.parse(message.content.toString());
      const method = message.properties.headers.method;
      const correlationId = message.properties.correlationId;

      if (method === KAFKA_TOPICS.TEST_BALANCE_GENESIS) {
        await producer.sendGenesis(RabbitMQueues.GENESISES, gearService.getGenesisHash());
        return;
      }

      if (method === KAFKA_TOPICS.TEST_BALANCE_GET && payload.genesis === gearService.getGenesisHash()) {
        console.log(`${new Date()} | Request`, payload);
        await transferBalanceProcess(payload, correlationId);
      }
    });
  } catch (error) {
    console.error(`${new Date()} | Direct exchange consumer error`, error);
  }
}
