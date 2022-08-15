import { KAFKA_TOPICS } from '@gear-js/common';

import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';

const topics = [KAFKA_TOPICS.TEST_BALANCE_GET, KAFKA_TOPICS.TEST_BALANCE_GENESIS];

async function kafkaCreateConnection(): Promise<void> {
  try {
    await Promise.all([
      kafkaProducer.connect(),
      kafkaConsumer.connect(),
      kafkaConsumer.subscribeConsumerTopics(topics),
    ]);
    await kafkaConsumer.run();
  } catch (err) {
    console.log(err);
  }
}

export { kafkaCreateConnection };
