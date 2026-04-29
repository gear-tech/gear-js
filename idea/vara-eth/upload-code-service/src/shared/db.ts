import type { ColumnType, Selectable } from 'kysely';
import { type Insertable, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Address, Hash, Hex } from 'viem';
import { config } from '../config.js';
import { generateJobId } from '../util.js';
import type { JobStatus, RequestCodeValidationParams } from './types.js';

export interface JobsTable {
  job_id: string;
  status: JobStatus;
  code_id: Hash;
  code: Hex | null;
  blob_hashes: Hash[];
  deadline: number;
  sender: Address;
  wvara_permit_signature: Hex;
  request_code_validation_signature: Hex;
  transaction_hash: Hash | null;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, Date>;
}

interface Database {
  jobs: JobsTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.db.name,
    user: config.db.username,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
  }),
});

type Job = Selectable<JobsTable>;
type NewJob = Insertable<JobsTable>;

const db = new Kysely<Database>({ dialect });

export async function createRequest(data: RequestCodeValidationParams): Promise<string> {
  const job_id = generateJobId(data.codeId);

  const item: NewJob = {
    job_id,
    status: 'pending',
    code_id: data.codeId,
    blob_hashes: data.blobHashes,
    deadline: data.deadline,
    code: data.code,
    sender: data.sender,
    wvara_permit_signature: data.wvaraPermitSignature,
    request_code_validation_signature: data.requestCodeValidationSignature,
  };

  await db.insertInto('jobs').values(item).execute();

  return job_id;
}

export async function getStatus(
  jobId: string,
): Promise<{ jobId: string; status: JobStatus; transactionHash?: string } | null> {
  const job = await db
    .selectFrom('jobs')
    .select(['job_id', 'status', 'transaction_hash'])
    .where('job_id', '=', jobId)
    .executeTakeFirst();

  if (!job) return null;

  return {
    jobId: job.job_id,
    status: job.status,
    ...(job.transaction_hash ? { transactionHash: job.transaction_hash } : {}),
  };
}

export async function setStatus(jobId: string, status: JobStatus, transactionHash?: Hash): Promise<void> {
  await db
    .updateTable('jobs')
    .where('job_id', '=', jobId)
    .set({
      status,
      ...(transactionHash ? { transaction_hash: transactionHash } : {}),
      ...(status === 'success' ? { code: null } : {}),
    })
    .execute();
}

export async function recoverPendingJobs(): Promise<string[]> {
  await db.updateTable('jobs').set('status', 'pending').where('status', '=', 'processing').execute();

  const rows = await db.selectFrom('jobs').select('job_id').where('status', '=', 'pending').execute();

  return rows.map((r) => r.job_id);
}

export async function getRequest(jobId: string): Promise<Job> {
  return db.selectFrom('jobs').selectAll().where('job_id', '=', jobId).executeTakeFirstOrThrow();
}
