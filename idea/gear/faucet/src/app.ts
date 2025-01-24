import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { healthcheckRouter } from './healthcheck.router';
import { GearService, TransferService } from './services';
import { BalanceService } from './general.router';

const swaggerDocument = YAML.load('./swagger.yaml');

interface InitializeAppProps {
  gearService: GearService;
  transferService: TransferService;
}

export const initializeApp = async ({ gearService, transferService }: InitializeAppProps) => {
  const app = express();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/health', healthcheckRouter);

  const balanceService = new BalanceService(transferService, gearService);
  balanceService.init();

  app.use('/', balanceService.getRouter());

  return app;
};
