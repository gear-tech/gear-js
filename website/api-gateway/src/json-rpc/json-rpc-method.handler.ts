import { KAFKA_TOPICS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { kafkaEventMap } from '../kafka/kafka-event-map';
import { kafkaProducer } from '../kafka/producer';

async function handleKafkaEventByTopic(kafkaTopic: KAFKA_TOPICS, params: KafkaParams): Promise<unknown> {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(kafkaTopic, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function jsonRpcMethodHandler(method: KAFKA_TOPICS, params: KafkaParams): Promise<any> {
  return handleKafkaEventByTopic(method, params);
}

export { jsonRpcMethodHandler };
