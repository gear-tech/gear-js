import express from 'express';

import config from './config';

import { changeStatus, healthcheckRouter } from './healthcheck.router';
import { connectToDB } from './database/app-data-source';
import { transferProcess } from './transfer-balance-process';
import { logger } from '@gear-js/common';
import { transferService } from './transfer.service';
import { rmqService } from './rmq';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  app.listen(port, () => {
    logger.info(`Healthckech server is running on port ${port}`);
  });

  await connectToDB();
  changeStatus('database');

  await transferService.init();
  await rmqService.init();
  changeStatus('rabbitMQ');
  transferProcess();
};

startApp();
