import { API_METHODS } from '@gear-js/common';
import { Message } from 'kafkajs';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { transformToSting } from '../utils';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(
  topic: API_METHODS | string,
  params: KafkaParams | string,
  correlationId?: string): Promise<void> {
  await producer.send({
    topic,
    messages: [createMessageBody(topic, params, correlationId)],
  });
}

function createMessageBody(topic: string, params: KafkaParams | string, correlationId?: string): Message {
  const result: Message = { value: transformToSting(params), headers: {} };

  if (correlationId) {
    result.headers = {  kafka_correlationId: correlationId,   kafka_replyTopic: `${topic}.reply` };
  }

  return result;
}

export const kafkaProducer = { sendByTopic, connect };
