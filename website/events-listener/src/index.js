import { GearApi } from '@gear-js/api';
import { listen } from './events.js';
import { KafkaProducer } from './producer.js';
import { logger } from './logger.js';

const log = logger('Main');

const main = async () => {
  log.info('App is running...');
  const producer = new KafkaProducer('events-listener');
  await producer.createTopic('events');
  await producer.connect();
  const api = await GearApi.create({});
  const chain = await api.chain();
  log.info(`Connected to ${chain}`);
  listen(api, ({ key, value }) => {
    producer.send(key, value, chain);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
