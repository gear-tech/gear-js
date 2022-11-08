import { KAFKA_TOPICS } from '@gear-js/common';
import { ITopicConfig } from 'kafkajs';

import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { kafkaProducer } from './producer';
import { kafkaConsumer } from './consumer';
import { apiGatewayLogger } from '../common/api-gateway.logger';
import { initKafka } from './init-kafka';

const topics = Object.values(KAFKA_TOPICS);
const replyTopics = Object.values(KAFKA_TOPICS).map(topic => (`${topic}.reply`));

async function kafkaCreateConnection(): Promise<void> {
  await Promise.all([kafkaProducer.connect(), kafkaConsumer.connect()]);
  await createTopics([...topics, ...replyTopics]);
  await kafkaConsumer.subscribeConsumerTopics(topics);
  await kafkaConsumer.run();

  changeStatus('kafka');

  apiGatewayLogger.info('Kafka connection initialized');
}

export async function createTopics(topics: string[]): Promise<void> {
  const admin = initKafka.admin();
  await admin.connect();
  const kafkaTopics = await admin.listTopics();

  for(const topic of topics){
    const isExistTopicInKafka = kafkaTopics.includes(topic);

    if(!isExistTopicInKafka) {
      const createTopic: ITopicConfig = { topic, numPartitions: 5 };

      await admin.createTopics({
        waitForLeaders: true,
        topics: [createTopic],
      });
    }
  }
  await admin.disconnect();
}

export { kafkaCreateConnection };
