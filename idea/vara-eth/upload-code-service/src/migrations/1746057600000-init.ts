import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('jobs')
    .addColumn('job_id', 'text', (col) => col.primaryKey())
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('pending'))
    .addColumn('network', 'text', (col) => col.notNull())
    .addColumn('code_id', 'text', (col) => col.notNull())
    .addColumn('code', 'text')
    .addColumn('blob_hashes', sql`text[]`, (col) => col.notNull())
    .addColumn('deadline', 'bigint', (col) => col.notNull())
    .addColumn('sender', 'text', (col) => col.notNull())
    .addColumn('wvara_permit_signature', 'text', (col) => col.notNull())
    .addColumn('request_code_validation_signature', 'text', (col) => col.notNull())
    .addColumn('transaction_hash', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await sql`
    CREATE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `.execute(db);

  await sql`
    CREATE TRIGGER jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `.execute(db);

  await db.schema.createIndex('idx_jobs_network_status').on('jobs').columns(['network', 'status']).execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('idx_jobs_network_status').execute();
  await sql`DROP TRIGGER jobs_updated_at ON jobs`.execute(db);
  await sql`DROP FUNCTION set_updated_at`.execute(db);
  await db.schema.dropTable('jobs').execute();
}
