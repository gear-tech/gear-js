import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/configuration';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('test-balance');
  logger.log(`App successfully run on the ${config().server.port} 🚀`);
  await app.listen(config().server.port);
}
bootstrap();
