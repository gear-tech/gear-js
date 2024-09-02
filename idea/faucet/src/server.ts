import { logger } from '@gear-js/common';
import config from './config';
import { connectToDB } from './database';
import { changeStatus } from './healthcheck.router';
import { initializeApp } from './app';
import { GearService, TransferService } from './services';

const port = config.server.port;

const initializeServices = async () => {
  const gearService = new GearService();
  await gearService.init();

  const transferService = new TransferService(gearService);
  return { gearService, transferService };
};

connectToDB()
  .then(() => {
    changeStatus('database');
    return initializeServices();
  })
  .then(initializeApp)
  .then((app) => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  });
