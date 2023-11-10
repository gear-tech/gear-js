import { logger } from '@gear-js/common';
import express from 'express';

import config from './config';
import { changeStatus, healthcheckRouter } from './healthcheck.router';
import { connectToDB } from './database';
import { GearService, RMQService, TransferService } from './services';

const app = express();

const port = config.healthcheck.port;
console.log(port);
app.use('/health', healthcheckRouter);

const startApp = async () => {
  app.listen(port, () => {
    logger.info(`Healthckech server is running on port ${port}`);
  });

  await connectToDB();
  changeStatus('database');

  const gearService = new GearService();
  await gearService.init();

  const transferService = new TransferService(gearService);

  const rmqService = new RMQService(transferService, gearService);
  await rmqService.init();

  changeStatus('rabbitMQ');
};

startApp();
