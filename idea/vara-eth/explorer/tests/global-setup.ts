import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const TEMP_CONFIG_FILE = '/tmp/vara-eth-explorer-test-db.json';

const MIGRATIONS_DIR = resolve(__dirname, '../../indexer-db/db/migrations');
const DUMP_PATH = resolve(__dirname, '../dump.sql');

// ── Shared helpers ─────────────────────────────────────────────────────────────

async function applyMigrations(client: Client) {
  const { readdirSync } = await import('node:fs');
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    const mod = await import(resolve(MIGRATIONS_DIR, file));
    await new mod.default().up(client);
  }
}

async function loadDump(host: string, port: number, user: string, password: string, database: string) {
  const { readFileSync, writeFileSync, unlinkSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');

  const dump = readFileSync(DUMP_PATH, 'utf8');
  const lines = dump.split('\n');
  const out: string[] = [];
  let skipBlock = false;

  for (const line of lines) {
    if (!skipBlock) {
      if (line.startsWith('\\restrict ') || line.startsWith('\\unrestrict ')) {
        continue;
      }
      if (line.startsWith('COPY public.migrations ')) {
        skipBlock = true;
        continue;
      }
      if (line.startsWith('COPY ') && !line.startsWith('COPY public.')) {
        skipBlock = true;
        continue;
      }
      out.push(line);
    } else {
      if (line === '\\.') {
        skipBlock = false;
      }
    }
  }

  const tmpPath = join(tmpdir(), `vara-eth-explorer-dump-${Date.now()}.sql`);
  writeFileSync(tmpPath, out.join('\n'));

  try {
    execSync(`psql -h ${host} -p ${port} -U ${user} -d ${database} -v ON_ERROR_STOP=1 -f "${tmpPath}"`, {
      env: { ...process.env, PGPASSWORD: password, PGOPTIONS: '-c session_replication_role=replica' },
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (err: any) {
    console.error('[loadDump] psql stderr:', err.stderr);
    throw err;
  } finally {
    try {
      unlinkSync(tmpPath);
    } catch {}
  }
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
    .withDatabase('vara_eth_test')
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
const LOCAL_PORT = parseInt(process.env.TEST_DB_PORT || '5432', 10);
const LOCAL_USER = process.env.TEST_DB_USERNAME || process.env.USER || 'postgres';
const LOCAL_PASSWORD = process.env.TEST_DB_PASSWORD || '';
const LOCAL_DB = `vara_eth_test_${Date.now()}`;

let localDbCreated = false;

async function setupLocalDb(): Promise<DbConfig> {
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
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
  });
  await client.connect();
  await applyMigrations(client);

  console.log('[test setup] Preparing TypeORM internal tables...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS "migrations" (
      "id" SERIAL PRIMARY KEY,
      "timestamp" BIGINT NOT NULL,
      "name" VARCHAR(255) NOT NULL
    )
  `);
  await client.end();

  console.log('[test setup] Loading dump data...');
  await loadDump(dbConfig.host, dbConfig.port, dbConfig.username, dbConfig.password, dbConfig.database);

  const { writeFileSync } = await import('node:fs');
  writeFileSync(TEMP_CONFIG_FILE, JSON.stringify(dbConfig));
  console.log(`[test setup] Ready (${usingContainer ? 'container' : 'local DB'}).\n`);
}

export async function teardown() {
  const { unlinkSync } = await import('node:fs');
  try {
    unlinkSync(TEMP_CONFIG_FILE);
  } catch {}

  if (container) {
    await container.stop();
  } else if (localDbCreated) {
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
