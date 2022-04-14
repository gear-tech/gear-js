import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configuration from './config/configuration';
import { waitReady } from '@polkadot/wasm-crypto';
import errors from '@gear-js/jsonrpc-errors';

async function bootstrap() {
  const configKafka = configuration().kafka;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configKafka.clientId,
        brokers: configKafka.brokers,
        sasl: {
          mechanism: 'plain',
          username: configKafka.sasl.username,
          password: configKafka.sasl.password,
        },
      },
      consumer: {
        groupId: configKafka.groupId,
      },
    },
  });
  await waitReady();
  await app.listen();
}
bootstrap();
