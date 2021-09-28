import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';
import { HttpExceptionFilter } from './http-rpc/exceptions';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use('/api/docs/', express.static(join(__dirname, '..', 'docs')));
  app.use('/api/test/', express.static(join(__dirname, '..', 'static')));
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  logger.log(`App successfully run on the ${port} 🚀`);
  await app.listen(port);
}
bootstrap();
