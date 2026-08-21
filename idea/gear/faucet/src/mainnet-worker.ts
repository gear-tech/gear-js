import { logger } from 'gear-idea-common';

import { AppDataSource } from './database/index.js';
import { MainnetAlertWorker, MainnetLifecycleWorker, MainnetPayoutWorker } from './services/index.js';

const payoutWorker = new MainnetPayoutWorker();
const lifecycleWorker = new MainnetLifecycleWorker();
const alertWorker = new MainnetAlertWorker();

AppDataSource.initialize()
  .then(async () => {
    logger.info('Database connected');
    await payoutWorker.init();
    payoutWorker.run();
    lifecycleWorker.run();
    alertWorker.run();
    logger.info('Mainnet workers started');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());

async function shutdown() {
  alertWorker.stop();
  lifecycleWorker.stop();
  payoutWorker.stop();
  await AppDataSource.destroy();
  process.exit(0);
}
