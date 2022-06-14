import express from 'express';

import config from './config/config';

import { GearService } from './domain/gear.service';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { DbService } from './database/db';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  const db = new DbService();
  await db.connect();
  changeStatus('database');
  const gear = new GearService(db);
  await gear.connect();
  changeStatus('ws');
  const kafka = new KafkaConsumer(gear, db);
  await kafka.connect();
  await kafka.subscribe(`testBalance.get`);
  changeStatus('kafka');
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });
};

startApp();
