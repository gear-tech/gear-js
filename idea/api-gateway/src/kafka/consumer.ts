import { initKafka } from './init-kafka';
import config from '../config/configuration';
import { deleteKafkaEvent, kafkaEventMap } from './kafka-event-map';

const configKafka = config().kafka;

export const consumer = initKafka.consumer({ groupId: configKafka.groupId });

async function connect(): Promise<void> {
  await consumer.connect();
}
async function run(): Promise<void> {
  await consumer.run({
    eachMessage: async ({ message }) => {
      const correlationId = message?.headers?.kafka_correlationId.toString();
      const resultFromService = kafkaEventMap.get(correlationId);
      if (resultFromService) await resultFromService(JSON.parse(message.value.toString()));
      deleteKafkaEvent(correlationId);
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

export const kafkaConsumer = { subscribeConsumerTopics, connect, run };
