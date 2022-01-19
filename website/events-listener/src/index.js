import { GearApi } from '@gear-js/api';
import { listen } from './events.js';
import { KafkaProducer } from './producer.js';
import { logger } from './logger.js';
import config from './config.js';

const log = logger('Main');

const main = async () => {
  log.info('App is running...');
  const api = await GearApi.create({ providerAddress: config.api.provider, throwOnConnect: true });
  const chain = await api.chain();
  const genesis = api.genesisHash.toHex();
  log.info(`Connected to ${chain} with genesis ${genesis}`);
  const producer = new KafkaProducer();
  await producer.createTopic('events');
  await producer.connect();
  listen(api, ({ key, value }) => {
    producer.send(key, value, genesis);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
