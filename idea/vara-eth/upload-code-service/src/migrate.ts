import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { config } from './config.js';

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: config.db.name,
      user: config.db.username,
      password: config.db.password,
      host: config.db.host,
      port: config.db.port,
    }),
  }),
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs: await import('node:fs/promises'),
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
});

const { error, results } = await migrator.migrateToLatest();

for (const result of results ?? []) {
  if (result.status === 'Success') {
    console.log(`Migration "${result.migrationName}" applied`);
  } else if (result.status === 'Error') {
    console.error(`Migration "${result.migrationName}" failed`);
  }
}

if (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}

await db.destroy();
