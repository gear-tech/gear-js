import { DataSource } from 'typeorm';

import config from '../config';
import { FaucetRequest, UserLastSeen } from './model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port) || 5432,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  migrationsRun: true,
  entities: [UserLastSeen, FaucetRequest],
  migrations: ['dist/database/migrations/*.js'],
  logging: ['migration', 'error'],
});
