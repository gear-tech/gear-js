import express from 'express';

import config from './config/configuration';

import { changeStatus, healthcheckRouter } from './routes/healthcheck.router';
import { connectToDB } from './database/data-source';
import { initAMQ } from './rabbitmq/init-rabbitmq';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  await connectToDB();
  changeStatus('database');
  await initAMQ();
  changeStatus('rabbitMQ');

  app.listen(port, () => {
    console.log(`Healthcheck server is running on port ${port} 🚀`);
  });
};

startApp();
