import { API_METHODS } from '@gear-js/common';
import { Message } from 'kafkajs';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { transformToSting } from '../utils';
import { servicesPartitionMap } from '../common/services-partition-map';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(
  topic: API_METHODS | string,
  params: KafkaParams,
  correlationId?: string): Promise<void> {
  await producer.send({
    topic,
    messages: [createMessageBody(topic, params, correlationId)],
  });
}

function createMessageBody(topic: string, params: KafkaParams, correlationId?: string): Message {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const sendMessagePartition = servicesPartitionMap.get(params.genesis);
  const result: Message = { value: transformToSting(params), headers: {} };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if(params.genesis && sendMessagePartition) {
    result.partition = Number(sendMessagePartition);
  }

  if (correlationId) {
    result.headers = {  kafka_correlationId: correlationId,   kafka_replyTopic: `${topic}.reply` };
  }

  return result;
}

export const kafkaProducer = { sendByTopic, connect };
