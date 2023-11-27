import { logger } from '@gear-js/common';

import { AppDataSource } from './database';
import { RMQService } from './rmq';
import { MetaService } from './service';

const main = async () => {
  await AppDataSource.initialize();
  logger.info('Connected to the database');

  const metaService = new MetaService();

  const rmq = new RMQService(metaService);
  await rmq.init();

  logger.info('Connected to RabbitMQ');
};

main().catch((error) => {
  logger.error("Can't start the indexer", { error, stack: error.stack });
  process.exit(1);
});
