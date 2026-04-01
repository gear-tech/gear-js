import { logger } from 'gear-idea-common';
import { main } from './app';
import config from './config';
import { AppDataSource } from './database';
import { MetaService } from './service';

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
