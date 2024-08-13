import { logger } from '@gear-js/common';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import config from './config';
import { changeStatus, healthcheckRouter } from './healthcheck.router';
import { connectToDB } from './database';
import { GearService, TransferService } from './services';
import { BalanceService } from './general.router';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = config.server.port;

app.use('/health', healthcheckRouter);

const startApp = async () => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });

  await connectToDB();
  changeStatus('database');

  const gearService = new GearService();
  await gearService.init();

  const transferService = new TransferService(gearService);
  const balanceService = new BalanceService(transferService, gearService);
  balanceService.init();

  app.use('/', balanceService.getRouter());
};

startApp();
