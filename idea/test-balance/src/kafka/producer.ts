import { Message, Producer } from 'kafkajs';

import { initKafka } from './init-kafka';

const producer: Producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function send(topic: string, value: string, correlationId?: string): Promise<void> {
  await producer.send({
    topic,
    messages: [createMessageBody(value, correlationId)],
  });
}

function createMessageBody(value: string, correlationId?: string): Message {
  const result: Message = { value, headers: {} };

  if (correlationId) {
    result.headers = { kafka_correlationId: correlationId };
  }

  return result;
}

export const kafkaProducer = { connect, send };
