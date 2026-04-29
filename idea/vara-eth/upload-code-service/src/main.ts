import { config } from './config.js';
import { buildApp } from './handler.js';
import { startQueue } from './queue.js';
import { recoverPendingJobs } from './shared/db.js';

const { enqueue, shutdown: shutdownQueue } = startQueue(config.workerConcurrency);

const pendingJobIds = await recoverPendingJobs();
for (const jobId of pendingJobIds) {
  enqueue(jobId);
}

const app = buildApp(enqueue);
await app.listen({ port: config.port, host: '0.0.0.0' });

const gracefulShutdown = async () => {
  app.log.info('Shutting down...');
  await app.close();
  await shutdownQueue();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
