import { KAFKA_TOPICS } from '@gear-js/common';
import { KafkaMessage } from 'kafkajs';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { deleteKafkaEvent, kafkaEventMap } from './kafka-event-map';
import { genesisHashesCollection } from '../common/genesis-hashes-collection';
import { sendServicePartition, setServicePartition } from '../common/helpers';

const configKafka = config.kafka;

export const consumer = initKafka.consumer({ groupId: configKafka.groupId });

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

async function subscribeConsumerTopics(topics: string[]): Promise<void> {
  const promises = topics.map((topic) =>
    consumer.subscribe({
      topic: `${topic}.reply`,
      fromBeginning: false,
    }),
  );
  await Promise.all(promises);
}

async function messageProcessing(message: KafkaMessage, topic: string): Promise<void> {
  if (message.value !== null) {
    if (topic === `${KAFKA_TOPICS.SERVICE_PARTITION_GET}.reply`) {
      console.log('Genesis received from data-storage:', message);
      await sendServicePartition(message, topic);
      return;
    }
    if (topic === `${KAFKA_TOPICS.SERVICES_PARTITION}.reply`) {
      await setServicePartition(message);
      return;
    }
    if (topic === `${KAFKA_TOPICS.TEST_BALANCE_GENESIS}.reply`) {
      const genesisHash = message.value.toString();

      genesisHashesCollection.add(genesisHash);

      console.log(`Genesis received from test-balance: ${genesisHash}`);
      return;
    } else {
      const correlationId = message.headers.kafka_correlationId.toString();
      const resultFromService = kafkaEventMap.get(correlationId);

      if (resultFromService) resultFromService(JSON.parse(message.value.toString()));

      deleteKafkaEvent(correlationId);
    }
  }
}

export const kafkaConsumer = { subscribeConsumerTopics, connect, run };
