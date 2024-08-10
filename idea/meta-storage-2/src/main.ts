import { logger } from '@gear-js/common';

import { AppDataSource } from './database';
import { MetaRouter } from './meta.router';
import { MetaService } from './service';
import express from 'express';
import config from './config';

const app = express();
const port = config.server.port;

const main = async () => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });

  await AppDataSource.initialize();
  logger.info('Connected to the database');

  const metaService = new MetaService();

  const meta = new MetaRouter(metaService);
  meta.init();
  app.use(meta.Router);
};

main().catch((error) => {
  logger.error("Can't start the indexer", { error, stack: error.stack });
  process.exit(1);
});
