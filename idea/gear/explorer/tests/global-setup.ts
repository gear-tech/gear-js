import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readdirSync, writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const TEMP_CONFIG_FILE = '/tmp/explorer-test-db.json';

const MIGRATIONS_DIR = resolve(__dirname, '../../squid/db/migrations');
const DUMP_PATH = resolve(__dirname, '../dump.sql');

// ── Shared helpers ─────────────────────────────────────────────────────────────

async function applyMigrations(client: Client) {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    // Migration up(db) expects { query(sql) } — pg.Client satisfies that interface
    const mod = await import(resolve(MIGRATIONS_DIR, file));
    await new mod.default().up(client);
  }

  // The dump includes a COPY into the migrations tracking table.
  // Create it so psql doesn't fail mid-stream and corrupt subsequent COPY blocks.
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.migrations (
      id   serial PRIMARY KEY,
      timestamp bigint NOT NULL,
      name character varying NOT NULL
    )
  `);
}

function loadDump(host: string, port: number, user: string, password: string, database: string) {
  // squid_processor.* COPY statements will fail (tables not created by migrations)
  // but psql continues by default, so public schema data loads fine.
  execSync(`psql -h ${host} -p ${port} -U ${user} -d ${database} < "${DUMP_PATH}"`, {
    env: { ...process.env, PGPASSWORD: password },
    stdio: 'pipe',
  });
}

// ── Docker path ────────────────────────────────────────────────────────────────

interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

let container: StartedPostgreSqlContainer | null = null;

async function setupWithContainer(): Promise<DbConfig> {
  container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('squid_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  return {
    host: container.getHost(),
    port: container.getMappedPort(5432),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
  };
}

// ── Local DB fallback path ─────────────────────────────────────────────────────

const LOCAL_HOST = process.env.TEST_DB_HOST || '127.0.0.1';
const LOCAL_PORT = parseInt(process.env.TEST_DB_PORT || '5432');
const LOCAL_USER = process.env.TEST_DB_USERNAME || process.env.USER || 'postgres';
const LOCAL_PASSWORD = process.env.TEST_DB_PASSWORD || '';
// Unique name so parallel runs don't collide and we know what to drop on teardown
const LOCAL_DB = `squid_test_${Date.now()}`;

let localDbCreated = false;

async function setupLocalDb(): Promise<DbConfig> {
  // Connect to the default postgres DB to create a fresh test database
  const admin = new Client({
    host: LOCAL_HOST,
    port: LOCAL_PORT,
    user: LOCAL_USER,
    password: LOCAL_PASSWORD,
    database: 'postgres',
  });
  await admin.connect();
  await admin.query(`CREATE DATABASE "${LOCAL_DB}"`);
  await admin.end();
  localDbCreated = true;

  return {
    host: LOCAL_HOST,
    port: LOCAL_PORT,
    username: LOCAL_USER,
    password: LOCAL_PASSWORD,
    database: LOCAL_DB,
  };
}

// ── Global setup / teardown ────────────────────────────────────────────────────

let dbConfig: DbConfig;

export async function setup() {
  let usingContainer = false;

  try {
    console.log('\n[test setup] Trying to start Postgres container...');
    dbConfig = await setupWithContainer();
    usingContainer = true;
    console.log('[test setup] Container started.');
  } catch {
    console.warn('[test setup] Docker not available — falling back to local Postgres.');
    dbConfig = await setupLocalDb();
    console.log(`[test setup] Created local database "${dbConfig.database}".`);
  }

  console.log('[test setup] Applying migrations...');
  const client = new Client(dbConfig);
  await client.connect();
  await applyMigrations(client);
  await client.end();

  console.log('[test setup] Loading dump data...');
  loadDump(dbConfig.host, dbConfig.port, dbConfig.username, dbConfig.password, dbConfig.database);

  writeFileSync(TEMP_CONFIG_FILE, JSON.stringify(dbConfig));
  console.log(`[test setup] Ready (${usingContainer ? 'container' : 'local DB'}).\n`);
}

export async function teardown() {
  try {
    unlinkSync(TEMP_CONFIG_FILE);
  } catch {}

  if (container) {
    await container.stop();
  } else if (localDbCreated) {
    // Drop the temporary local DB we created
    const admin = new Client({
      host: LOCAL_HOST,
      port: LOCAL_PORT,
      user: LOCAL_USER,
      password: LOCAL_PASSWORD,
      database: 'postgres',
    });
    await admin.connect();
    await admin.query(`DROP DATABASE IF EXISTS "${LOCAL_DB}"`);
    await admin.end();
    console.log(`[test teardown] Dropped local database "${LOCAL_DB}".`);
  }
}
