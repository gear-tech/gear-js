import { GearApi } from '@gear-js/api';

import { listen } from './events';
import { KafkaProducer } from './producer';
import { logger } from './logger';
import config from './config';
import { restartIfNeeded, setRestartNeeded } from './lifecycle';

const log = logger('Main');

let shouldRun = true;

process.on('SIGTERM', () => {
  shouldRun = false;
});

process.on('SIGINT', () => {
  shouldRun = false;
});

const main = async () => {
  while (shouldRun) {
    log.info('Starting...');
    const api = await GearApi.create({ providerAddress: config.api.provider, throwOnConnect: true });
    api.on('error', () => {
      setRestartNeeded();
    });

    const chain = await api.chain();
    const genesis = api.genesisHash.toHex();

    log.info(`Connected to ${chain} with genesis ${genesis}`);

    const producer = new KafkaProducer();
    await producer.createTopic('events');
    await producer.connect();

    listen(api, genesis, ({ key, value }) => {
      producer.send(key, value, genesis);
    });

    log.info('Started.');

    await restartIfNeeded;
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
