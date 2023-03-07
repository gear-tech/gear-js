import express from 'express';

import config from './config/configuration';

import { changeStatus, healthcheckRouter } from './routes/healthcheck.router';
import { connectToDB } from './database/app-data-source';
import { gearService } from './gear';
import { initAMQ } from './rabbitmq/init-rabbitmq';
import { transferProcess } from './common/transfer-balance-process';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });

  await connectToDB();
  changeStatus('database');

  await gearService.init();
  await initAMQ();
  changeStatus('rabbitMQ');
  transferProcess();
};

startApp();
