import { parentPort } from 'node:worker_threads';
import { createLogger } from '@gear-js/logger';
import { runProcessor } from '../runner.js';

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
