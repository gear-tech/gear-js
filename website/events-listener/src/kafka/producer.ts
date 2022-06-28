import { kafkaLogger } from '@gear-js/common';

import { Kafka, Producer } from 'kafkajs';
import config from '../config/configuration';
import { eventListenerLogger } from '../common/event-listener.logger';

export class KafkaProducer {
  readonly kafka: Kafka;
  readonly producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      logCreator: kafkaLogger,
      sasl: {
        mechanism: 'plain',
        username: config.kafka.sasl.username,
        password: config.kafka.sasl.password,
      },
    });
    this.producer = this.kafka.producer();
  }

  async createTopic(topic: string) {
    const admin = this.kafka.admin();
    try {
      await admin.connect();
      eventListenerLogger.info('Kafka producer: Admin is connected');
    } catch (error) {
      eventListenerLogger.error(error);
      eventListenerLogger.error('Admin is not connected');
      throw error;
    }
    try {
      const topics = await admin.listTopics();
      if (!topics.includes(topic)) {
        await admin.createTopics({
          waitForLeaders: true,
          topics: [
            {
              topic,
            },
          ],
        });
        eventListenerLogger.info(`Kafka producer: Topic ${topic} created`);
      } else {
        eventListenerLogger.warn(`Kafka producer: Topic ${topic} already existed`);
      }
    } catch (error) {
      eventListenerLogger.error(`Kafka producer: ${error}`);
      await admin.disconnect();
      eventListenerLogger.info(`Admin is disconnected`);
      throw error;
    }
    await admin.disconnect();
    eventListenerLogger.info(`Admin is disconnected`);
  }

  async connect() {
    await this.producer.connect();
    eventListenerLogger.info('Producer is connected');
  }

  async send(key: string, value: string, genesis: string) {
    await this.producer.send({
      topic: 'events',
      messages: [{ key, value: JSON.stringify(value), headers: { genesis } }],
    });
  }
}
