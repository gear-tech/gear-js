import express from 'express';

import config from './config/configuration';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { connectToGearNode } from './gear';
import { kafkaCreateConnection } from './kafka/kafka-create-connection';
import { eventListenerLogger, EVENTS_LISTENER_ROUTERS } from './common';

const app = express();

const port = config.healthcheck.port;

app.use(EVENTS_LISTENER_ROUTERS.HEALTH, healthcheckRouter);

const startApp = async () => {
  await kafkaCreateConnection();
  changeStatus('kafka');

  app.listen(port, () => {
    eventListenerLogger.info(`Healthckech server is running on port ${port} 🚀`);
  });

  // It's necessary to retain connection during runtimeUpgrade
  while (true) {
    await connectToGearNode();
    console.log('Reconnecting...');
  }
};

startApp().catch((error) => {
  console.error(error);
  process.exit(1);
});
