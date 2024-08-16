import { MetaRouter } from './meta.router';
import { MetaService } from './service';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./swagger.yaml');

export const main = async (metaService: MetaService) => {
  const app = express();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const meta = new MetaRouter(metaService);
  meta.init();

  app.use(meta.Router);

  return app;
};
