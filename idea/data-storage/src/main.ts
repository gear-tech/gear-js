import { NestFactory } from '@nestjs/core';
import { waitReady } from '@polkadot/wasm-crypto';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import { changeStatus } from './healthcheck/healthcheck.controller';
import { dataStorageLogger } from './common/data-storage.logger';
import { AppDataSource } from './data-source';
import { GearEventListener } from './gear/gear-event-listener';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

async function bootstrap() {
  const { healthcheck } = configuration();

  try {
    await AppDataSource.initialize();

    dataStorageLogger.info('Data Source has been initialized!');
  } catch (error) {
    dataStorageLogger.error('Error during Data Source initialization');
    throw error;
  }

  await AppDataSource.destroy();

  const app = await NestFactory.create(AppModule, { cors: true });

  changeStatus('database');

  await waitReady();

  const rabbitmqService = app.get(RabbitmqService);
  const gearEventListener = app.get(GearEventListener);

  await rabbitmqService.connect();

  setInterval( async () => {
    await rabbitmqService.connect().catch((error) => {
      console.log(`${new Date()}`, error);
      process.exit(0);
    });
  }, 1000);

  await app.listen(healthcheck.port);

  await gearEventListener.run();
}

bootstrap();
