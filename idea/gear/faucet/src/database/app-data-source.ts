import { DataSource } from 'typeorm';

import { FaucetRequest, UserLastSeen } from './model';
import config from '../config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port) || 5432,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: true,
  entities: [UserLastSeen, FaucetRequest],
  migrations: [],
});
