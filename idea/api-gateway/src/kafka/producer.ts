import { KAFKA_TOPICS } from '@gear-js/common';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { transformToSting } from '../utils';
import { Message } from 'kafkajs';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(topic: KAFKA_TOPICS, params: KafkaParams, correlationId?: string): Promise<void> {
  await producer.send({
    topic,
    messages: [getSendKafkaMessages(topic, params, correlationId)],
  });
}

function getSendKafkaMessages(topic: string, params: KafkaParams, correlationId?: string): Message {
  const result: Message = { value: transformToSting(params), headers: {} };

  if (correlationId) {
    result.headers = {  kafka_correlationId: correlationId,   kafka_replyTopic: `${topic}.reply` };
    return result;
  }

  return result;
}

export const kafkaProducer = { sendByTopic, connect };
