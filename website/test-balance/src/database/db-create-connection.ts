import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
  getRepository,
  Repository,
} from 'typeorm';
import { initLogger } from '@gear-js/common';

import config from '../config/configuration';
import { TransferBalance } from './entities/transfer.entity';

const logger = initLogger('DB_TEST_BALANCE');

const entities = [TransferBalance];

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  entities,
  synchronize: true,
};

let transferRepo: Repository<TransferBalance>;

async function dbCreateConnection(): Promise<Connection | null> {
  try {
    const conn = await createConnection(ormConfig);
    transferRepo = getRepository(TransferBalance);
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

export { dbCreateConnection, transferRepo };
