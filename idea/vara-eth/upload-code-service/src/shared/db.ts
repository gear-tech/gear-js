import type { ColumnType, Insertable, Selectable } from 'kysely';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Address, Hash, Hex } from 'viem';

import { config } from '../config.js';
import { generateJobId } from '../util.js';
import type { JobStatus, RequestCodeValidationParams } from './types.js';

export interface JobsTable {
  job_id: string;
  status: JobStatus;
  network: string;
  code_id: Hash;
  code: Hex | null;
  blob_hashes: Hash[];
  deadline: number;
  sender: Address;
  wvara_permit_signature: Hex;
  request_code_validation_signature: Hex;
  transaction_hash: Hash | null;
  error: string | null;
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

export async function createRequest(network: string, data: RequestCodeValidationParams): Promise<string> {
  const job_id = generateJobId(network, data.codeId);

  const item: NewJob = {
    job_id,
    network,
    status: 'pending',
    code_id: data.codeId,
    blob_hashes: data.blobHashes,
    deadline: data.deadline,
    code: data.code,
    sender: data.sender,
    wvara_permit_signature: data.wvaraPermitSignature,
    request_code_validation_signature: data.requestCodeValidationSignature,
  };

  await db
    .insertInto('jobs')
    .values(item)
    .onConflict((oc) =>
      oc
        .column('job_id')
        .doUpdateSet({
          status: 'pending',
          error: null,
          code: item.code,
          blob_hashes: item.blob_hashes,
          deadline: item.deadline,
          sender: item.sender,
          wvara_permit_signature: item.wvara_permit_signature,
          request_code_validation_signature: item.request_code_validation_signature,
        })
        .where('jobs.status', '=', 'failed'),
    )
    .execute();

  return job_id;
}

export async function getStatus(
  jobId: string,
): Promise<{ jobId: string; status: JobStatus; transactionHash?: string; error?: string } | null> {
  const job = await db
    .selectFrom('jobs')
    .select(['job_id', 'status', 'transaction_hash', 'error'])
    .where('job_id', '=', jobId)
    .executeTakeFirst();

  if (!job) return null;

  return {
    jobId: job.job_id,
    status: job.status,
    ...(job.transaction_hash ? { transactionHash: job.transaction_hash } : {}),
    ...(job.error ? { error: job.error } : {}),
  };
}

export async function setStatus(
  jobId: string,
  status: JobStatus,
  transactionHash?: Hash,
  error?: string,
): Promise<void> {
  await db
    .updateTable('jobs')
    .where('job_id', '=', jobId)
    .set({
      status,
      ...(transactionHash ? { transaction_hash: transactionHash } : {}),
      ...(status === 'success' ? { code: null } : {}),
      error: error ?? null,
    })
    .execute();
}

export async function recoverPendingJobs(): Promise<Array<{ jobId: string; network: string }>> {
  await db.updateTable('jobs').set('status', 'pending').where('status', '=', 'processing').execute();

  const rows = await db.selectFrom('jobs').select(['job_id', 'network']).where('status', '=', 'pending').execute();

  return rows.map((r) => ({ jobId: r.job_id, network: r.network }));
}

export async function getRequest(jobId: string): Promise<Job> {
  return db.selectFrom('jobs').selectAll().where('job_id', '=', jobId).executeTakeFirstOrThrow();
}
