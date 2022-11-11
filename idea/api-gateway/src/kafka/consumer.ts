import { KAFKA_TOPICS } from '@gear-js/common';
import { KafkaMessage } from 'kafkajs';

import config from '../config/configuration';
import { initKafka } from './init-kafka';
import { deleteKafkaEvent, kafkaEventMap } from './kafka-event-map';
import { sendServicePartition, setServicePartition } from '../common/helpers';
import { dataStoragePartitionsMap } from '../common/data-storage-partitions-map';

const configKafka = config.kafka;

export const consumer = initKafka.consumer({
  groupId: configKafka.groupId,
  maxBytesPerPartition: 10485760, //10 mb
  maxBytes: 104857600,
});

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
      await sendServicePartition(message, topic);

      console.log('Genesises received from data-storages:', ...dataStoragePartitionsMap);
      return;
    }
    if (topic === `${KAFKA_TOPICS.SERVICES_PARTITION}.reply`) {
      await setServicePartition(message);

      console.log('Genesises received from data-storages:', ...dataStoragePartitionsMap);
      return;
    }
    if (topic === `${KAFKA_TOPICS.TEST_BALANCE_GENESIS}.reply`) {
      const genesisHash = message.value.toString();

      // testBalanceGenesisCollection.add(genesisHash);

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
