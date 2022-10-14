import { Consumer, KafkaMessage } from 'kafkajs';
import { KAFKA_TOPICS } from '@gear-js/common';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { gearService } from '../gear';
import { sendGenesis } from '../common/send-genesis';
import { transferBalanceProcess } from '../common/transfer-balance-process';

const consumer: Consumer = initKafka.consumer({ groupId: config.kafka.groupId });

async function subscribeConsumerTopics(topics: string[]): Promise<void> {
  const promises = topics.map((topic) => consumer.subscribe({ topic }));
  await Promise.all(promises);
}

async function connect(): Promise<void> {
  await consumer.connect();
}

async function run(): Promise<void> {
  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      try {
        await messageProcessing(message, topic);
      } catch (error) {
        console.log(error);
      }
    },
  });
}

function messageProcessing(message: KafkaMessage, topic: string): Promise<void | { error: string }> {
  const payload = JSON.parse(message.value.toString());

  if (topic === KAFKA_TOPICS.TEST_BALANCE_GENESIS) {
    return sendGenesis();
  }

  if (payload.genesis === gearService.getGenesisHash()) {
    console.log(`Request`, payload);
    return transferBalanceProcess(message, payload);
  }
}

export const kafkaConsumer = { subscribeConsumerTopics, connect, run };
