import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configuration from './config/configuration';
import { waitReady } from '@polkadot/wasm-crypto';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { Logger } from '@nestjs/common';
import { changeStatus } from './healthcheck/healthcheck.controller';

const logger = new Logger('Main');

async function bootstrap() {
  const { kafka, healthcheck } = configuration();

  const healthCheckApp = await NestFactory.create(HealthcheckModule, { cors: true });
  logger.log(`HelathCheckApp successfully run on the ${healthcheck.port} 🚀`);
  await healthCheckApp.listen(healthcheck.port);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafka.clientId,
        brokers: kafka.brokers,
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
