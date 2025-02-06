import { logger } from 'gear-idea-common';
import { AppDataSource } from './database';
import { main } from './app';
import { MetaService } from './service';
import config from './config';

const port = config.server.port;

const initMetaService = () => {
  logger.info('Connected to the database');
  return new MetaService();
};

AppDataSource.initialize()
  .then(initMetaService)
  .then(main)
  .then((app) => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    logger.error("Can't start the meta-storage", { error, stack: error.stack });
    process.exit(1);
  });
