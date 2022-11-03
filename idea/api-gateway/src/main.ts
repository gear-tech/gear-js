import express from 'express';

import { apiGatewayRouter } from './routes/api-gateway/api-gateway.router';
import { healthcheckRouter } from './routes/healthcheck/healthcheck.router';
import { kafkaCreateConnection } from './kafka/kafka-create-connection';
import configuration from './config/configuration';
import { runSchedulerGenesisHashes } from './common/scheduler-genesis-hashes';
import { apiGatewayLogger } from './common/api-gateway.logger';
import { networkKafkaPartitions } from './common/helpers';
import { createKafkaPartitions } from './common/helpers/create-kafka-partitions';

const app = express();

const port = configuration.server.port;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

//Routes
app.use('/api', apiGatewayRouter);
app.use('/health', healthcheckRouter);

const startApp = async () => {
  await createKafkaPartitions();
  await kafkaCreateConnection();
  await networkKafkaPartitions();
  await runSchedulerGenesisHashes();

  app.listen(port, () => {
    apiGatewayLogger.info(`App successfully run on the ${port} 🚀`);
  });
};

startApp();
