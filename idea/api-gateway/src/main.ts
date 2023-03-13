import express from 'express';

import { apiGatewayRouter } from './routes/api-gateway/api-gateway.router';
import { healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { apiGatewayLogger } from './common/api-gateway.logger';
import { initAMQ } from './rabbitmq/init-rabbitmq';
import { runScheduler } from './common/scheduler';
import configuration from './config/configuration';

const app = express();

const port = configuration.server.port;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

//Routes
app.use('/api', apiGatewayRouter);
app.use('/health', healthcheckRouter);

const startApp = async () => {
  await initAMQ();
  await runScheduler();

  app.listen(port, () => {
    apiGatewayLogger.info(`⚙️ 🚀 App successfully run on the ${port}️`);
  });
};

startApp();
