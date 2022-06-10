import { GearApi } from '@gear-js/api';
import { logger } from '@gear-js/common';

import { listen } from './events';
import { KafkaProducer } from './producer';
import config from './config';
import { restartIfNeeded, setRestartNeeded } from './lifecycle';
import { changeStatus } from './healthcheck';

export const EVENTS_LISTENER = 'EVENTS_LISTENER';

const main = async () => {
  while (true) {
    logger.info(`${EVENTS_LISTENER} Starting...`);
    const api = await GearApi.create({ providerAddress: config.api.provider, throwOnConnect: true });
    changeStatus('ws');
    api.on('error', () => {
      setRestartNeeded();
    });

    const chain = await api.chain();
    const genesis = api.genesisHash.toHex();

    logger.info(`${EVENTS_LISTENER} Connected to ${chain} with genesis ${genesis}`);

    const producer = new KafkaProducer();
    await producer.createTopic('events');
    await producer.connect();
    changeStatus('kafka');

    listen(api, genesis, ({ key, value }) => {
      producer.send(key, value, genesis);
    });

    logger.info(`${EVENTS_LISTENER} Started`);

    await restartIfNeeded;
  }
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
