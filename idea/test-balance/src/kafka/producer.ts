import { Message, Producer } from 'kafkajs';

import { initKafka } from './init-kafka';

const producer: Producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function send(topic: string, value: string, correlationId?: string): Promise<void> {
  await producer.send({
    topic,
    messages: [getSendKafkaMessages(value, correlationId)],
  });
}

function getSendKafkaMessages(value: string, correlationId?: string): Message {
  const result: { value: string; headers: { kafka_correlationId?: string } } = { value, headers: {} };

  if (correlationId) {
    result.headers.kafka_correlationId = correlationId;
    return result;
  }
  return result;
}

export const kafkaProducer = { connect, send };
