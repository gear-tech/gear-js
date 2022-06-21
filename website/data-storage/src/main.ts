import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { waitReady } from '@polkadot/wasm-crypto';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { changeStatus } from './healthcheck/healthcheck.controller';
import { dataStorageLogger } from './common/data-storage.logger';
import { kafkaLogger } from '@gear-js/common';

async function bootstrap() {
  const { kafka, healthcheck } = configuration();

  const healthCheckApp = await NestFactory.create(HealthcheckModule, { cors: true });
  dataStorageLogger.info(`HelathCheckApp successfully run on the ${healthcheck.port} 🚀`);
  await healthCheckApp.listen(healthcheck.port);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafka.clientId,
        brokers: kafka.brokers,
        logCreator: kafkaLogger,
        sasl: {
          mechanism: 'plain',
          username: kafka.sasl.username,
          password: kafka.sasl.password,
        },
      },
      consumer: {
        groupId: kafka.groupId,
      },
    },
  });
  await waitReady();
  changeStatus('database');
  await app.listen();
  changeStatus('kafka');
}
bootstrap();
