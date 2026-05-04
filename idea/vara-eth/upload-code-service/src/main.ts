import { initKzgLoading } from '@vara-eth/api/util';

import { config } from './config.js';
import { prepareCodeValidation, sendCodeValidation } from './eth.js';
import { startQueue } from './queue.js';
import { runServer } from './server.js';
import { recoverPendingJobs } from './shared/db.js';

initKzgLoading();

const queues = new Map(
  config.networks.map((networkConfig) => {
    const prepareFn = prepareCodeValidation.bind(null, networkConfig);
    const sendFn = sendCodeValidation.bind(null, networkConfig);
    const queue = startQueue(config.workerConcurrency, prepareFn, sendFn);
    return [networkConfig.name, queue] as const;
  }),
);

function enqueueForNetwork(network: string, jobId: string): void {
  const queue = queues.get(network);
  if (!queue) throw new Error(`No queue for network: ${network}`);
  queue.enqueue(jobId);
}

const app = await runServer(enqueueForNetwork);

const pendingJobs = await recoverPendingJobs();
for (const { jobId, network } of pendingJobs) {
  enqueueForNetwork(network, jobId);
}

const gracefulShutdown = async () => {
  app.log.info('Shutting down...');
  await app.close();
  await Promise.all([...queues.values()].map((q) => q.shutdown()));
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
