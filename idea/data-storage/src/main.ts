import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { waitReady } from '@polkadot/wasm-crypto';
import { kafkaLogger } from '@gear-js/common';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import { changeStatus } from './healthcheck/healthcheck.controller';
import { dataStorageLogger } from './common/data-storage.logger';
import { AppDataSource } from './data-source';
import { GearEventListener } from './gear/gear-event-listener';

async function bootstrap() {
  const { kafka, healthcheck } = configuration();

  try {
    await AppDataSource.initialize();

    dataStorageLogger.info('Data Source has been initialized!');
  } catch (error) {
    dataStorageLogger.error('Error during Data Source initialization');
    throw error;
  }

  const app = await NestFactory.create(AppModule, { cors: true });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafka.clientId,
        brokers: kafka.brokers,
        logCreator: kafkaLogger,
        // sasl: {
        //   mechanism: 'plain',
        //   username: kafka.sasl.username,
        //   password: kafka.sasl.password,
        // },
      },
      consumer: {
        groupId: kafka.groupId,
      },
      producer:{ }
    },
  });

  await app.startAllMicroservices();
  changeStatus('kafka');
  await waitReady();
  changeStatus('database');

  await AppDataSource.destroy();

  await app.listen(healthcheck.port);

  const gearEventListener = app.get(GearEventListener);
  await gearEventListener.listen();
}

bootstrap();
