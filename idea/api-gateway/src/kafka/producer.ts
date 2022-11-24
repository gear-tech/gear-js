import { API_METHODS } from '@gear-js/common';
import { Message } from 'kafkajs';

import { initKafka } from './init-kafka';
import { KafkaParams } from './types';
import { dataStoragePartitionsMap } from '../common/data-storage-partitions-map';

const producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function sendByTopic(
  topic: API_METHODS | string,
  params: KafkaParams | string,
  correlationId?: string,
): Promise<void> {
  const message: Message = { value: JSON.stringify(params), headers: {} };
  const genesis: string = params['genesis'];

  if (dataStoragePartitionsMap.has(genesis)) {
    message.partition = Number(dataStoragePartitionsMap.get(genesis));
  }

  if (correlationId) {
    message.headers = { kafka_correlationId: correlationId, kafka_replyTopic: `${topic}.reply` };
  }

  await producer.send({ topic, messages: [message] });
}

export const kafkaProducer = { sendByTopic, connect };
