import { Kafka } from 'kafkajs';
import { logger } from './logger.js';
import config from './config.js';

const log = logger('KafkaProducer');

export class KafkaProducer {
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

  async createTopic(topic) {
    const admin = this.kafka.admin();
    try {
      await admin.connect();
      log.info('Admin is connected');
    } catch (error) {
      log.error(error);
      log.error('Admin is not connected');
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
        log.info(`Topic <${topic}> created`);
      } else {
        log.warn(`Topic <${topic}> already existed`);
      }
    } catch (error) {
      log.error(error);
      await admin.disconnect();
      log.info('Admin is disconnected');
      throw error;
    }
    await admin.disconnect();
    log.info('Admin is disconnected');
  }

  async connect() {
    await this.producer.connect();
    log.info('Producer is connected');
  }

  async send(key, value, chainName, genesis) {
    this.producer.send({
      topic: 'events',
      messages: [{ key, value: JSON.stringify(value), headers: { chain: chainName, genesis } }],
    });
  }
}
