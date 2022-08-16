import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from './producer';

const topics: string[] = [KAFKA_TOPICS.EVENTS, KAFKA_TOPICS.MESSAGES_UPDATE_DATA];

async function kafkaCreateConnection(): Promise<void> {
  await kafkaProducer.createTopics(topics);
  await kafkaProducer.connect();
}

export { kafkaCreateConnection };
