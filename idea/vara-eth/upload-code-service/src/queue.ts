import { createLogger } from '@gear-js/logger';
import type { Address, Hash, Hex } from 'viem';
import { BaseError, hexToBytes } from 'viem';

import { getRequest, setStatus } from './shared/db.js';
import { PermanentJobError } from './shared/types.js';

const logger = createLogger('queue');

class AsyncQueue<T> {
  private items: T[] = [];
  private waiters: Array<(item: T) => void> = [];

  enqueue(item: T): void {
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter(item);
    } else {
      this.items.push(item);
    }
  }

  dequeue(): Promise<T> {
    const item = this.items.shift();
    if (item !== undefined) return Promise.resolve(item);
    return new Promise((resolve) => this.waiters.push(resolve));
  }
}

class Mutex {
  private queue: Array<() => void> = [];
  private locked = false;

  acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }
}

const SHUTDOWN = Symbol('shutdown');
type Item = string | typeof SHUTDOWN;

type PrepareFn<T> = (
  code: Uint8Array,
  codeId: Hash,
  sender: Address,
  blobHashes: Hash[],
  deadline: bigint,
  wvaraPermitSignature: Hex,
  requestCodeValidationSignature: Hex,
) => Promise<T>;

type SendFn<T> = (tx: T) => Promise<{ transactionHash: Hash; status: 'success' | 'reverted' }>;

export function startQueue<T>(concurrency: number, prepareFn: PrepareFn<T>, sendFn: SendFn<T>) {
  const queue = new AsyncQueue<Item>();
  const sendMutex = new Mutex();
  let shuttingDown = false;

  async function processJob(jobId: string): Promise<void> {
    logger.info({ jobId }, 'Processing job');
    try {
      await setStatus(jobId, 'processing');
      const job = await getRequest(jobId);
      logger.debug({ jobId, codeId: job.code_id, sender: job.sender }, 'Job data loaded');

      logger.info({ jobId, codeId: job.code_id }, 'Preparing transaction');
      const tx = await prepareFn(
        hexToBytes(job.code!),
        job.code_id,
        job.sender,
        job.blob_hashes,
        BigInt(job.deadline),
        job.wvara_permit_signature,
        job.request_code_validation_signature,
      );
      logger.info({ jobId }, 'Transaction prepared, waiting for send mutex');

      await sendMutex.acquire();
      logger.info({ jobId }, 'Send mutex acquired, sending transaction');
      let result: Awaited<ReturnType<SendFn<T>>>;
      try {
        result = await sendFn(tx);
      } finally {
        sendMutex.release();
        logger.debug({ jobId }, 'Send mutex released');
      }

      logger.info({ jobId, transactionHash: result.transactionHash, status: result.status }, 'Transaction sent');
      await setStatus(jobId, result.status === 'success' ? 'success' : 'failed', result.transactionHash);
      logger.info({ jobId, status: result.status }, 'Job completed');
    } catch (err) {
      const isPermanent = err instanceof PermanentJobError;
      const errorMessage =
        err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
      if (isPermanent) {
        logger.warn({ jobId, error: errorMessage }, 'Job permanently failed (contract rejected)');
      } else {
        logger.error({ jobId, error: errorMessage }, 'Failed to process job');
      }
      await setStatus(jobId, 'failed', undefined, errorMessage).catch(() => {});
    }
  }

  async function worker(): Promise<void> {
    while (true) {
      const item = await queue.dequeue();
      if (item === SHUTDOWN) return;
      await processJob(item);
    }
  }

  const workers = Array.from({ length: concurrency }, worker);

  logger.info({ concurrency }, 'Queue started');

  return {
    enqueue(jobId: string): void {
      if (shuttingDown) {
        logger.warn({ jobId }, 'Attempted to enqueue job during shutdown, ignoring');
        return;
      }
      logger.info({ jobId }, 'Job enqueued');
      queue.enqueue(jobId);
    },
    async shutdown(): Promise<void> {
      logger.info('Queue shutting down, draining workers');
      shuttingDown = true;
      for (let i = 0; i < concurrency; i++) queue.enqueue(SHUTDOWN);
      await Promise.all(workers);
      logger.info('Queue shutdown complete');
    },
  };
}
