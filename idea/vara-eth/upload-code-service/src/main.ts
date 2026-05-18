import { createLogger } from '@gear-js/logger';
import { initKzgLoading } from '@vara-eth/api/util';

import { config } from './config.js';
import { prepareCodeValidation, sendCodeValidation } from './eth.js';
import { startQueue } from './queue.js';
import { runServer } from './server.js';
import { recoverPendingJobs } from './shared/db.js';

const logger = createLogger('main');

initKzgLoading();
logger.info('KZG loading initialized');

logger.info(
  { networks: config.networks.map((n) => n.name), workerConcurrency: config.workerConcurrency },
  'Starting queues',
);
const queues = new Map(
  config.networks.map((networkConfig) => {
    const prepareFn = prepareCodeValidation.bind(null, networkConfig);
    const sendFn = sendCodeValidation.bind(null, networkConfig);
    const queue = startQueue(config.workerConcurrency, prepareFn, sendFn);
    logger.info({ network: networkConfig.name }, 'Queue initialized');
    return [networkConfig.name, queue] as const;
  }),
);

function enqueueForNetwork(network: string, jobId: string): void {
  const queue = queues.get(network);
  if (!queue) throw new Error(`No queue for network: ${network}`);
  queue.enqueue(jobId);
}

const app = await runServer(enqueueForNetwork);
logger.info({ port: config.port }, 'Server started');

const pendingJobs = await recoverPendingJobs();
if (pendingJobs.length > 0) {
  logger.info({ count: pendingJobs.length }, 'Recovering pending jobs');
  for (const { jobId, network } of pendingJobs) {
    logger.info({ jobId, network }, 'Re-enqueuing pending job');
    enqueueForNetwork(network, jobId);
  }
} else {
  logger.info('No pending jobs to recover');
}

const gracefulShutdown = async () => {
  logger.info('Graceful shutdown initiated');
  app.log.info('Shutting down...');
  await app.close();
  await Promise.all([...queues.values()].map((q) => q.shutdown()));
  logger.info('Shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
