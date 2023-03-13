import { DataSource } from 'typeorm';

import { Block, Code, Message, Meta, Program, State, StateToCode } from './database/entities';
import config from './config/configuration';

const entities = [Meta, Message, Program, Code, Block, State, StateToCode];
const { database } = config();
// Do not delete DataSource
// TypeORM CLI commands has been changed (0.3.X)
// Official documentation do not have all actual information about this part
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: database.user,
  password: database.password,
  database: database.name,
  entities,
  migrations: ['./dist/database/migrations/*.js'],
  synchronize: false,
  logging: true,
  // Run migrations automatically,
  migrationsRun: true,
});
