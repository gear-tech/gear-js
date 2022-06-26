import express from 'express';
import { KAFKA_TOPICS } from '@gear-js/common';

import config from './config/configuration';

import { KafkaConsumer } from './kafka/kafka.consumer';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { dbCreateConnection } from './database/db-create-connection';
import { gearService } from './gear';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  await dbCreateConnection();
  changeStatus('database');
  await gearService.connect();
  changeStatus('ws');
  const kafka = new KafkaConsumer();
  await kafka.connect();
  await kafka.subscribe(KAFKA_TOPICS.TEST_BALANCE_GET);
  changeStatus('kafka');
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });
};

startApp();
