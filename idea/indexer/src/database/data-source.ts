import { DataSource } from 'typeorm';

import { Block, Code, Message, Program, State, Status } from './entities';
import config from '../config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  entities: [Message, Program, Code, Block, State, Status],
  migrations: ['./dist/database/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: ['error', 'schema'],
});
