import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';

const topics = [KAFKA_TOPICS.TEST_BALANCE_GET, KAFKA_TOPICS.TEST_BALANCE_GENESIS];

export async function kafkaCreateConnection(): Promise<void> {
  await Promise.all([kafkaProducer.connect(), kafkaConsumer.connect()]);

  await kafkaConsumer.subscribeConsumerTopics(topics);

  await kafkaConsumer.run();
}
