import express from 'express';

import config from './config/configuration';

import { changeStatus, healthcheckRouter } from './routes/healthcheck.router';
import { connectToDB } from './database/app-data-source';
import { gearService } from './gear';
import { kafkaCreateConnection } from './kafka/kafka-create-connection';
import { sendGenesis } from './common/send-genesis';
import { initAMQP } from '@gear-js/api-gateway/src/rabbitmq/init-rabbitmq';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  app.listen(port, () => {
    console.log(`Healthckech server is running on port ${port} 🚀`);
  });

  await connectToDB();
  changeStatus('database');

  gearService.init(async () => {
    await initAMQP();
    await kafkaCreateConnection();
    changeStatus('kafka');
    await sendGenesis();
  });
};

startApp();
