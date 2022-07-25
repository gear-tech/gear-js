import { KAFKA_TOPICS } from '@gear-js/common';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { transformToSting } from '../utils';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(topic: KAFKA_TOPICS, correlationId: string, params: KafkaParams): Promise<void> {
  await producer.send({
    topic,
    messages: [
      {
        value: transformToSting(params),
        headers: {
          kafka_correlationId: correlationId,
          kafka_replyTopic: `${topic}.reply`,
        },
      },
    ],
  });
}

export const kafkaProducer = { sendByTopic, connect };
