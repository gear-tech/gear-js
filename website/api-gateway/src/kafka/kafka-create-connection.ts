import { KAFKA_TOPICS } from '@gear-js/common';

import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { apiGatewayLogger } from '../common/event-listener.logger';
import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';

const topics = Object.values(KAFKA_TOPICS);

async function kafkaCreateConnection(): Promise<void> {
  try {
    await Promise.all([
      kafkaProducer.connect(),
      kafkaConsumer.connect(),
      kafkaConsumer.subscribeConsumerTopics(topics),
    ]);
    await kafkaConsumer.run();
    changeStatus('kafka');
    apiGatewayLogger.info(`Kafka connection initialized`);
  } catch (err) {
    apiGatewayLogger.error(`Kafka err:${err}`);
  }
}

export { kafkaCreateConnection };
