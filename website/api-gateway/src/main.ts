import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import configuration from './config/configuration';
const logger = new Logger('Main');

async function bootstrap() {
  const port = configuration().server.port;
  console.log(configuration());
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix('api');
  logger.log(`App successfully run on the ${port} 🚀`);
  await app.listen(port);
}
bootstrap();
