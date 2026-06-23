import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { MetaRouter } from './meta.router.js';
import type { MetaService } from './service.js';

const swaggerDocument = YAML.load('./swagger.yaml');

export const main = async (metaService: MetaService) => {
  const app = express();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const meta = new MetaRouter(metaService);
  meta.init();

  app.use(meta.Router);

  return app;
};
