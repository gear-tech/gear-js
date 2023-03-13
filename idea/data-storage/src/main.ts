import { NestFactory } from '@nestjs/core';
import { waitReady } from '@polkadot/wasm-crypto';

import { AppModule } from './app.module';
import configuration from './config/configuration';
import { changeStatus } from './healthcheck/healthcheck.controller';
import { dataStorageLogger } from './common/data-storage.logger';
import { AppDataSource } from './data-source';
import { GearService } from './gear/gear.service';
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
  const gearEventListener = app.get(GearService);

  await rabbitmqService.connect();

  await gearEventListener.run();

  await app.listen(healthcheck.port, () => {
    console.log(`⚙️ Healthcheck app is running on ${healthcheck.port} port`);
  });
}

bootstrap();
