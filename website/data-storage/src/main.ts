import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { waitReady } from '@polkadot/wasm-crypto';
import { kafkaLogger } from '@gear-js/common';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import { changeStatus } from './healthcheck/healthcheck.controller';
import { dataStorageLogger } from './common/data-storage.logger';
import { AppDataSource } from './data-source';

async function bootstrap() {
  const { kafka, healthcheck } = configuration();

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(healthcheck.port);
  dataStorageLogger.info(`HelathCheck app is running on ${healthcheck.port} 🚀`);
  AppDataSource.initialize()
    .then(() => {
      dataStorageLogger.info('Data Source has been initialized!');
    })
    .catch((err) => {
      dataStorageLogger.error(`Error during Data Source initialization: ${err}`);
    });

  app.connectMicroservice<MicroserviceOptions>({
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

  await app.startAllMicroservices();
  changeStatus('kafka');
  await waitReady();
  changeStatus('database');
}
bootstrap();
