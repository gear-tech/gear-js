import { Kafka } from 'kafkajs';
import { kafkaLogger } from '@gear-js/common';

import config from '../config/configuration';

const configKafka = config().kafka;

const initKafka: Kafka = new Kafka({
  clientId: configKafka.clientId,
  brokers: configKafka.brokers,
  logCreator: kafkaLogger,
  sasl: {
    mechanism: 'plain',
    username: configKafka.sasl.username,
    password: configKafka.sasl.password,
  },
});

export { initKafka };
