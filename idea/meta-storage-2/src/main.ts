import { MetaRouter } from './meta.router';
import { MetaService } from './service';
import express from 'express';

export const main = async (metaService: MetaService) => {
  const app = express();

  const meta = new MetaRouter(metaService);
  meta.init();

  app.use(meta.Router);

  return app;
};
