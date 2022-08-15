import { Admin, Message, Producer } from 'kafkajs';
import { KAFKA_TOPICS } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { initKafka } from './init-kafka';
import { SendByKafkaTopicInput } from './types';

const producer: Producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
  eventListenerLogger.info('Producer is connected');
}

async function send(sendByKafkaTopicInput: SendByKafkaTopicInput): Promise<void> {
  const { method } = sendByKafkaTopicInput;
  await producer.send({
    topic: method,
    messages: getMessageFormByTopic(sendByKafkaTopicInput),
  });
}

async function createTopics(topics: string[]): Promise<void> {
  const admin = initKafka.admin();
  await connectKafkaAdmin(admin);
  await createKafkaTopics(admin, topics);
  await admin.disconnect();
  eventListenerLogger.info('Admin is disconnected');
}

async function connectKafkaAdmin(admin: Admin): Promise<void> {
  try {
    await admin.connect();
    eventListenerLogger.info('Kafka producer: Admin is connected');
  } catch (error) {
    eventListenerLogger.error(error);
    eventListenerLogger.error('Admin is not connected');
    throw error;
  }
}

async function createKafkaTopics(admin: Admin, topics: string[]): Promise<void> {
  for (const topic of topics) {
    try {
      const kafkaTopics = await admin.listTopics();
      if (!isTopicAlreadyExist(kafkaTopics, topic)) {
        await admin.createTopics({
          waitForLeaders: true,
          topics: [{ topic }],
        });
        eventListenerLogger.info(`Kafka producer: Topic ${topic} created`);
      } else {
        eventListenerLogger.info(`Kafka producer: Topic ${topic} already existed`);
      }
    } catch (error) {
      eventListenerLogger.error(`Kafka producer: ${error}`);
      throw error;
    }
  }

  await admin.disconnect();
  eventListenerLogger.info('Admin is disconnected');
}

function isTopicAlreadyExist(topics: string[], topic: string): boolean {
  return topics.includes(topic);
}

function getMessageFormByTopic(sendByKafkaTopicInput: SendByKafkaTopicInput): Message[] {
  const { genesis, params, key, method } = sendByKafkaTopicInput;
  if (key && method === KAFKA_TOPICS.EVENTS) {
    return [{ key, value: JSON.stringify(params), headers: { genesis } }];
  }
  return [{ value: JSON.stringify(params) }];
}

export const kafkaProducer = { connect, send, createTopics };
