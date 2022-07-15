import { API_METHODS } from '@gear-js/common';

import { kafkaProducer } from './producer';

const topics: string[] = [API_METHODS.EVENTS, API_METHODS.MESSAGE_UPDATE_DATA];

async function kafkaCreateConnection(): Promise<void> {
  await kafkaProducer.createTopics(topics);
  await kafkaProducer.connect();
}

export { kafkaCreateConnection };
