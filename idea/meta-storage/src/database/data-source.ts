import { DataSource } from 'typeorm';

import { Code, Meta } from './entities';
import config from '../config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  entities: [Meta, Code],
  migrations: ['./dist/database/migrations/*.js'],
  synchronize: true,
  migrationsRun: false,
  logging: ['error', 'schema'],
});
