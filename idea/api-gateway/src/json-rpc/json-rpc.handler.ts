import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { kafkaEventMap } from '../kafka/kafka-event-map';
import { kafkaProducer } from '../kafka/producer';
import { RpcResponse } from './types';

async function handleKafkaEventByTopic(topic: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(topic, params, correlationId,);

  let topicEvent;
  const res: Promise<RpcResponse> = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function jsonRpcHandler(method: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  return handleKafkaEventByTopic(method, params);
}

export { jsonRpcHandler };
