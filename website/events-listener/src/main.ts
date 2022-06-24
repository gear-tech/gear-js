import { GearApi } from '@gear-js/api';
import express from 'express';

import { KafkaProducer } from './kafka/producer';
import config from './config/configuration';
import { restartIfNeeded, setRestartNeeded } from './lifecycle';
import { eventListenerLogger } from './common/event-listener.logger';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { listen } from './gear-events';

const app = express();

const port = config.healthcheck.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  const api = await GearApi.create({ providerAddress: config.api.provider, throwOnConnect: true });
  changeStatus('ws');
  api.on('error', () => {
    setRestartNeeded();
  });

  const chain = await api.chain();
  const genesis = api.genesisHash.toHex();

  eventListenerLogger.info(`Connected to ${chain} with genesis ${genesis}`);

  const producer = new KafkaProducer();
  await producer.createTopic('events');
  await producer.connect();
  changeStatus('kafka');

  listen(api, genesis, ({ key, value }) => {
    producer.send(key, value, genesis);
  });

  app.listen(port, () => {
    eventListenerLogger.info(`Healthckech server is running on port ${port} 🚀`);
  });

  await restartIfNeeded;
};

startApp();
