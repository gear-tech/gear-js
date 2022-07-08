import { KAFKA_TOPICS } from '@gear-js/common';
import { nanoid } from 'nanoid';

import { KafkaParams } from '../kafka/types';
import { kafkaEventMap } from '../kafka/kafka-event-map';
import { kafkaProducer } from '../kafka/producer';

async function sendByKafkaTopic(topic: KAFKA_TOPICS, params: KafkaParams): Promise<unknown> {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(topic, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function jsonRpcMethodHandler(method: KAFKA_TOPICS, params: KafkaParams): Promise<any> {
  return sendByKafkaTopic(method, params);
}

export { jsonRpcMethodHandler };
