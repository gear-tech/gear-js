import { parentPort } from 'node:worker_threads';
import { runProcessor } from '../runner.js';
import { createLogger } from '@gear-js/logger';

const logger = createLogger('processor-worker');

runProcessor()
  .then(() => {
    logger.info('Processor worker started successfully');
    parentPort?.postMessage({ type: 'ready' });
  })
  .catch((error) => {
    logger.error(error, 'Processor worker failed to start');
    parentPort?.postMessage({ type: 'error', error: error.message });
    process.exit(1);
  });
