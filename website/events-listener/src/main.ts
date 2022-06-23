import { GearApi } from '@gear-js/api';
import express from 'express';

import { KafkaProducer } from './kafka/producer';
import config from './config/configuration';
import { restartIfNeeded, setRestartNeeded } from './lifecycle';
import { eventListenerLogger } from './common/event-listener.logger';
import { changeStatus, healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { listen } from './gear-events';

const main = async () => {
  while (true) {
    const app = express();

    app.use('/health', healthcheckRouter);

    eventListenerLogger.info(`Starting...`);
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

    eventListenerLogger.info(`Started`);
    app.listen(config.healthcheck.port, () => {
      eventListenerLogger.info(`Healthckech server is running on port ${config.healthcheck.port} 🚀`);
    });

    await restartIfNeeded;
  }
};

main().catch((error) => {
  eventListenerLogger.error(error);
  process.exit(1);
});
