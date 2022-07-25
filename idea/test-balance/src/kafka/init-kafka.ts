import { kafkaLogger } from '@gear-js/common';
import { Kafka } from 'kafkajs';

import config from '../config/configuration';

const initKafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  logCreator: kafkaLogger,
  sasl: {
    mechanism: 'plain',
    username: config.kafka.sasl.username,
    password: config.kafka.sasl.password,
  },
});

export { initKafka };
