import { parentPort } from 'node:worker_threads';
import { runServer } from '../api.js';
import { createLogger } from '@gear-js/logger';

const logger = createLogger('server-worker');

runServer()
  .then(() => {
    logger.info('Server worker started successfully');
    parentPort?.postMessage({ type: 'ready' });
  })
  .catch((error) => {
    logger.error(error, 'Server worker failed to start');
    parentPort?.postMessage({ type: 'error', error: error.message });
    process.exit(1);
  });
