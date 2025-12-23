import 'reflect-metadata';

import { createLogger } from '@gear-js/logger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

const logger = createLogger('api');

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: ['error', 'warn'],
  });

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Vara.Eth Indexer API')
    .setDescription('REST API for querying Vara.Eth blockchain data')
    .setVersion('1.0')
    .addTag('programs', 'Program operations')
    .addTag('codes', 'Code operations')
    .addTag('batches', 'Batch operations')
    .addTag('state-transitions', 'State transition operations')
    .addTag('messages', 'Message operations')
    .addTag('replies', 'Reply operations')
    .addTag('transactions', 'Transaction operations')
    .addTag('lookup', 'Lookup entity by hash')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.API_PORT || process.env.GQL_PORT || 4350;
  const host = '0.0.0.0';

  await app.listen({ port: Number(port), host });

  logger.info(`🚀 Vara.Eth API running on http://${host}:${port}/api`);
  logger.info(`📚 Swagger documentation available at http://${host}:${port}/docs`);

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrap().catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}
