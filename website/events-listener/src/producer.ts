import { logger } from '@gear-js/common';

import { Kafka, Producer } from 'kafkajs';
import config from './config';
import { EVENTS_LISTENER } from './index';

export class KafkaProducer {
  readonly kafka: Kafka;
  readonly producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
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
      logger.info(`${EVENTS_LISTENER} Kafka producer: Admin is connected`);
    } catch (error) {
      logger.info(`${EVENTS_LISTENER} Kafka producer: Admin is connected`);
      logger.error(`${EVENTS_LISTENER}: ${error}`);
      logger.error(`${EVENTS_LISTENER}: Admin is not connected`);
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
        logger.info(`${EVENTS_LISTENER} Kafka producer: Topic ${topic} created`);
      } else {
        logger.warn(`${EVENTS_LISTENER} Kafka producer: Topic ${topic} already existed`);
      }
    } catch (error) {
      logger.error(`${EVENTS_LISTENER} Kafka producer: ${error}`);
      await admin.disconnect();
      logger.error(`${EVENTS_LISTENER}: Admin is not connected`);
      throw error;
    }
    await admin.disconnect();
    logger.error(`${EVENTS_LISTENER}: Admin is not connected`);
  }

  async connect() {
    await this.producer.connect();
    logger.info(`${EVENTS_LISTENER}: Producer is connected`);
  }

  async send(key: string, value: string, genesis: string) {
    this.producer.send({
      topic: 'events',
      messages: [{ key, value: JSON.stringify(value), headers: { genesis } }],
    });
  }
}
