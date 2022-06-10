import { Kafka } from 'kafkajs';
import { KAFKA_TOPICS, logger } from '@gear-js/common';

import config from '../config/configuration';
import { changeStatus } from '../routes/healthcheck/healthcheck.router';
import { deleteKafkaEvent, kafkaEventMap } from './kafka-event-map';
import { transformToSting } from '../utils';
import { KafkaParams } from './types';
import { API_GATEWAY } from '../common/constant';

const configKafka = config().kafka;
const topics = Object.values(KAFKA_TOPICS);

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
        const correlationId = message?.headers?.kafka_correlationId.toString();
        const resultFromService = kafkaEventMap.get(correlationId);
        if (resultFromService) await resultFromService(JSON.parse(message.value.toString()));
        deleteKafkaEvent(correlationId);
      },
    });
    changeStatus('kafka');
    logger.info(`${API_GATEWAY}:Kafka connection initialized`);
  } catch (err) {
    logger.error(`${API_GATEWAY} Kafka err:${err}`);
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
