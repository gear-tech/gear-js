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
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });

  await connectToDB();
  changeStatus('database');

  await kafkaCreateConnection();
  changeStatus('kafka');

  while (true) {
    await gearService.connect();
    console.log('Reconnecting...');
  }
};

startApp();
