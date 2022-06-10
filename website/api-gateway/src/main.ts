import * as express from 'express';
import { logger } from '@gear-js/common';

import { apiGatewayRouter } from './routes/api-gateway/api-gateway.router';
import { healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import configuration from './config/configuration';
import { connectKafka } from './kafka/kafka';
import { API_GATEWAY } from './common/constant';

const app = express();
app.use(express.json());

const port = configuration().server.port;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

//Routes
app.use('/api', apiGatewayRouter);
app.use('/health', healthcheckRouter);

const startApp = async () => {
  await connectKafka();
  app.listen(port, () => {
    logger.info(`${API_GATEWAY} app successfully run on the ${port} 🚀`);
  });
};
startApp();
