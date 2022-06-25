import { ConnectionOptions } from 'typeorm';

import { TransferBalance } from '../database/entities/transfer.entity';

import config from './configuration';

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

export { ormConfig };
