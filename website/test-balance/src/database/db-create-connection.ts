import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { initLogger } from '@gear-js/common';

import { ormConfig } from '../config/orm.config';

const logger = initLogger('DB_TEST_BALANCE');

export async function dbCreateConnection(): Promise<Connection | null> {
  try {
    const conn = await createConnection(ormConfig);

    logger.info(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
  } catch (err) {
    if (err.name === 'AlreadyHasActiveConnectionError') {
      const activeConnection = getConnectionManager().get(ormConfig.name);
      return activeConnection;
    }
    logger.error(err);
  }
  return null;
}
