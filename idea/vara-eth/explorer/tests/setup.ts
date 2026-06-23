import { readFileSync } from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import 'reflect-metadata';
import supertest from 'supertest';

import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';
import { TEMP_CONFIG_FILE } from './global-setup.js';

function getDbConfig() {
  try {
    return JSON.parse(readFileSync(TEMP_CONFIG_FILE, 'utf8'));
  } catch {
    return {
      host: process.env.TEST_DB_HOST || '127.0.0.1',
      port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
      username: process.env.TEST_DB_USERNAME || process.env.LOGNAME || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_DATABASE || 'vara_eth_test',
    };
  }
}

let app: NestFastifyApplication;
let _agent: ReturnType<typeof supertest>;

export async function setup() {
  const dbConfig = getDbConfig();
  process.env.DB_URL = `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

  // Dynamically import AppModule so DB_URL is resolved before any module-level config is evaluated.
  const { AppModule } = await import('../src/app.module.js');

  app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: false,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  await app.listen({ port: 0, host: '127.0.0.1' });

  _agent = supertest(app.getHttpServer());
}

export async function teardown() {
  await app?.close();
}

export const getAgent = (): ReturnType<typeof supertest> => _agent;
