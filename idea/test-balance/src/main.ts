import express from 'express';

import config from './config/configuration';

import { changeStatus, healthcheckRouter } from './routes/healthcheck.router';
import { connectToDB } from './database/app-data-source';
import { gearService } from './gear';
import { kafkaCreateConnection } from './kafka/kafka-create-connection';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  await connectToDB();
  changeStatus('database');
  await gearService.connect();
  changeStatus('ws');
  await kafkaCreateConnection();
  changeStatus('kafka');
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });
};

startApp();
