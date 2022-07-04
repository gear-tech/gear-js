import { Admin, Producer } from 'kafkajs';
import { eventListenerLogger } from '../common/event-listener.logger';
import { initKafka } from './init-kafka';

const producer: Producer = initKafka.producer();

async function connect(): Promise<void> {
  await producer.connect();
  eventListenerLogger.info('Producer is connected');
}

async function send(key: string, value: string, genesis: string): Promise<void> {
  await producer.send({
    topic: 'events',
    messages: [{ key, value: JSON.stringify(value), headers: { genesis } }],
  });
}

async function createTopic(topic: string): Promise<void> {
  const admin = initKafka.admin();
  await connectKafkaAdmin(admin);
  await createKafkaTopic(admin, topic);
  await admin.disconnect();
  eventListenerLogger.info(`Admin is disconnected`);
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

async function createKafkaTopic(admin: Admin, topic: string): Promise<void> {
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

  await admin.disconnect();
  eventListenerLogger.info(`Admin is disconnected`);
}

function isTopicAlreadyExist(topics: string[], topic: string): boolean {
  return topics.includes(topic);
}

export const kafkaProducer = { connect, send, createTopic };
