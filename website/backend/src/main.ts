import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { HttpExceptionFilter } from './http-rpc/exceptions';
import { Logger } from '@nestjs/common';
import configuration from './config/configuration';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/api/docs/', express.static(join(__dirname, '..', 'docs')));
  app.use('/api/test/', express.static(join(__dirname, '..', 'static')));
  logger.log(`App successfully run on the ${configuration().server.port} 🚀`);
  await app.listen(configuration().server.port);
}
bootstrap();
