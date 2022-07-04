import express from 'express';

import config from './config/configuration';

import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { dbCreateConnection } from './database/db-create-connection';
import { gearService } from './gear';
import { connectKafka } from './kafka/kafka';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  await dbCreateConnection();
  changeStatus('database');
  await gearService.connect();
  changeStatus('ws');
  await connectKafka();
  changeStatus('kafka');
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });
};

startApp();
