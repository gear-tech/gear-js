import { initLogger } from '@gear-js/common';

import { AppDataSource } from './app-data-source';

const logger = initLogger('DB_TEST_BALANCE');

async function dbCreateConnection(): Promise<void> {
  try {
    await AppDataSource.initialize();
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
}

export { dbCreateConnection };
