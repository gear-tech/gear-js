import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from './producer';

async function kafkaCreateConnection(): Promise<void> {
  await kafkaProducer.createTopic(KAFKA_TOPICS.EVENTS);
  await kafkaProducer.connect();
}

export { kafkaCreateConnection };
