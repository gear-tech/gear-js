import swaggerUi from 'swagger-ui-express';
import { logger } from 'gear-idea-common';
import express from 'express';
import YAML from 'yamljs';

import { VaraBridgeRouter, VaraTestnetRouter } from './routes';
import { RequestService } from './services';
import config from './config';

const swaggerDocument = YAML.load('./swagger.yaml');

export const runServer = (requestService: RequestService) => {
  const app = express();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/', new VaraTestnetRouter(requestService).router);
  app.use('/bridge', new VaraBridgeRouter(requestService).router);

  app.listen(config.server.port, () => {
    logger.info(`Server is running in port ${config.server.port}`);
  });
};
