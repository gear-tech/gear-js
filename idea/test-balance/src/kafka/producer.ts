import { Producer } from 'kafkajs';

import { initKafka } from './init-kafka';

const producer: Producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
}

async function send(message: any, value: string) {
  await producer.send({
    topic: message.headers.kafka_replyTopic.toString(),
    messages: [
      {
        value,
        headers: { kafka_correlationId: message.headers.kafka_correlationId.toString() },
      },
    ],
  });
}

export const kafkaProducer = { connect, send };
