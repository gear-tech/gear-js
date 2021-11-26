import { Kafka } from 'kafkajs';
import { logger } from './logger.js';

const log = logger('KafkaProducer');

export class KafkaProducer {
  constructor(clientId, brokers) {
    console.log(brokers);
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    console.log(this.kafka);
    this.producer = this.kafka.producer();
    console.log(this.producer);
  }

  async createTopic(topic) {
    const admin = this.kafka.admin();
    const topics = await admin.listTopics();
    if (!topics.includes(topic)) {
      await admin.createTopics({
        topics: [
          {
            topic,
          },
        ],
      });
      log.info(`Topic <${topic}> created`);
    }
    log.warn(`Topic <${topic}> already existed`);
  }

  async connect() {
    await this.producer.connect();
    log.info('Producer is connected');
  }

  async send(key, value, chainName) {
    log.info(`Send ${key}`);
    console.log(value);
    this.producer.send({
      topic: 'events',
      messages: [{ key, value: JSON.stringify(value), headers: { chain: chainName } }],
    });
  }
}
