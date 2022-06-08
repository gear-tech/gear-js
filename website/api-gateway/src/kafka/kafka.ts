import { Kafka } from 'kafkajs';

import config from '../config/configuration';
import { KAFKA_TOPICS, kafkaProducerTopics } from '../common/kafka-producer-topics';
import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { logger } from '../helpers/logger';
import { kafkaEventMap } from './kafka-event-map';
import { transformToSting } from '../utils';
import { KafkaParams } from './types';

const configKafka = config().kafka;
const topics = Object.values(kafkaProducerTopics);

const kafka = new Kafka({
  clientId: configKafka.clientId,
  brokers: configKafka.brokers,
  sasl: {
    mechanism: 'plain',
    username: configKafka.sasl.username,
    password: configKafka.sasl.password,
  },
});

const kafkaConsumer = kafka.consumer({ groupId: configKafka.groupId });
const kafkaProducer = kafka.producer();

async function connectKafka() {
  try {
    await Promise.all([kafkaProducer.connect(), kafkaConsumer.connect(), subscribeConsumerTopics(topics)]);
    await kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const resultFromService = kafkaEventMap.get(message?.headers?.kafka_correlationId.toString());
        if (resultFromService) await resultFromService(JSON.parse(message.value.toString()));
      },
    });
    changeStatus('kafka');
    logger.info('Kafka------------>Connection initialized');
  } catch (err) {
    logger.error(`connectKafka:${err}`);
  }
}

async function subscribeConsumerTopics(topics: string[]): Promise<void> {
  const promises = topics.map((topic) =>
    kafkaConsumer.subscribe({
      topic: `${topic}.reply`,
      fromBeginning: false,
    }),
  );
  await Promise.all(promises);
}

async function kafkaSendByTopic(topic: KAFKA_TOPICS, correlationId: string, params: KafkaParams): Promise<void> {
  await kafkaProducer.send({
    topic,
    messages: [
      {
        value: transformToSting(params),
        headers: {
          kafka_correlationId: correlationId,
          kafka_replyTopic: `${topic}.reply`,
        },
      },
    ],
  });
}

export { kafkaConsumer, kafkaProducer, connectKafka, kafkaSendByTopic };
