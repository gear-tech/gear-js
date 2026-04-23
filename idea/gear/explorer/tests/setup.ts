import { readFileSync } from 'node:fs';
import { createDbConnection } from 'gear-idea-indexer-db';
import 'reflect-metadata';
import type { SuperTest, Test } from 'supertest';
import supertest from 'supertest';
import type { DataSource } from 'typeorm';

import { HybridApiServer } from '../src/server.js';
import { AllInOneService } from '../src/services/all-in-one.js';
import { GENESIS } from './fixtures.js';
import { TEMP_CONFIG_FILE } from './global-setup.js';

function getDbConfig() {
  // Prefer the testcontainer config written by globalSetup
  try {
    return JSON.parse(readFileSync(TEMP_CONFIG_FILE, 'utf8'));
  } catch {
    // Fallback: use env vars or local defaults (useful when running without testcontainers)
    return {
      host: process.env.TEST_DB_HOST || '127.0.0.1',
      port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
      username: process.env.TEST_DB_USERNAME || process.env.USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_DATABASE || 'squid_idea',
    };
  }
}

let dataSource: DataSource;
let _agent: SuperTest<Test>;

export async function setup() {
  dataSource = await createDbConnection(getDbConfig());

  const services = new Map([[GENESIS, new AllInOneService(dataSource)]]);
  const server = new HybridApiServer(services);

  // Access the express app directly — skip server.run() to avoid Redis connection
  const app = (server as any)._app;
  _agent = supertest(app);
}

export async function teardown() {
  await dataSource?.destroy();
}

export const getAgent = (): SuperTest<Test> => _agent;
