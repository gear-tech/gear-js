import { API_METHODS } from '@gear-js/common';
import { Message } from 'kafkajs';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { servicesPartitionMap } from '../common/services-partition-map';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(
  topic: API_METHODS | string,
  params: KafkaParams | string,
  correlationId?: string,
): Promise<void> {
  console.log(createMessageBody(topic, params, correlationId));
  await producer.send({
    topic,
    messages: [createMessageBody(topic, params, correlationId)],
  });
}

function createMessageBody(topic: string, params: KafkaParams | string, correlationId?: string): Message {
  const sendMessagePartition = servicesPartitionMap.get(params['genesis']);
  const result: Message = { value: JSON.stringify(params), headers: {} };

  if (params['genesis'] && sendMessagePartition) {
    result.partition = Number(sendMessagePartition);
  }

  if (correlationId) {
    result.headers = { kafka_correlationId: correlationId, kafka_replyTopic: `${topic}.reply` };
  }

  return result;
}

export const kafkaProducer = { sendByTopic, connect };
