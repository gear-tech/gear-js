import { DataSource } from 'typeorm';

import { Message, Meta, Program } from './entities';
import config from './config/configuration';

const entities = [Meta, Message, Program];

// Do not delete DataSource
// TypeORM CLI commands has been changed (0.3.X)
// Official documentation do not have all actual information about this part
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.user,
  password: config().database.password,
  database: config().database.name,
  entities,
  migrations: ['./dist/database/migrations/*.js'],
  synchronize: false,
  logging: true,
  // Run migrations automatically,
  migrationsRun: true,
});
