import { DataSource } from 'typeorm';

import { Block, Code, Message, Meta, Program, State, StateToCode, Status } from './entities';
import config from '../config';

const entities = [Meta, Message, Program, Code, Block, State, StateToCode, Status];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities,
  migrations: ['./dist/database/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: ['error', 'schema'],
});
