import { GearApi } from '@gear-js/api';

import { listen } from './events';
import { KafkaProducer } from './producer';
import config from './config';
import { restartIfNeeded, setRestartNeeded } from './lifecycle';
import { changeStatus } from './healthcheck';
import { eventListenerLogger } from './common/event-listener.logger';

const main = async () => {
  while (true) {
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

    await restartIfNeeded;
  }
};

main().catch((error) => {
  eventListenerLogger.error(error);
  process.exit(1);
});
