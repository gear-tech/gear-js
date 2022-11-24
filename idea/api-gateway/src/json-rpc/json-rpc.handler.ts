import { API_METHODS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { kafkaEventMap } from '../kafka/kafka-event-map';
import { kafkaProducer } from '../kafka/producer';
import { RpcResponse } from './types';

export async function jsonRpcHandler(topic: API_METHODS, params: KafkaParams): Promise<RpcResponse> {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(topic, params, correlationId);

  let topicEvent;
  const res: Promise<RpcResponse> = new Promise((resolve) => (topicEvent = resolve));

  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}
