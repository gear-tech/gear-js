import { KAFKA_TOPICS } from '@gear-js/common';
import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';

async function kafkaCreateConnection(): Promise<void> {
  try {
    await Promise.all([
      kafkaProducer.connect(),
      kafkaConsumer.connect(),
      kafkaConsumer.subscribeConsumerTopic(KAFKA_TOPICS.TEST_BALANCE_GET),
    ]);
    await kafkaConsumer.run();
  } catch (err) {
    console.log(err);
  }
}

export { kafkaCreateConnection };
