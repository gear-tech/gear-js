import { KAFKA_TOPICS } from '@gear-js/common';

import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';
import { apiGatewayLogger } from '../common/api-gateway.logger';

const topics = Object.values(KAFKA_TOPICS);

async function kafkaCreateConnection(): Promise<void> {
  await Promise.all([kafkaProducer.connect(), kafkaConsumer.connect()]);
  await kafkaConsumer.subscribeConsumerTopics(topics);
  await kafkaConsumer.run();

  changeStatus('kafka');

  apiGatewayLogger.info('Kafka connection initialized');
}

export { kafkaCreateConnection };
