import { DataSource } from 'typeorm';

import config from '../config/configuration';
import { Meta } from './entities/meta.entity';

const entities = [Meta];

export const dataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port) || 5432,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  entities,
  migrations: ['./dist/database/migrations/*.js'],
  migrationsRun: true,
});

export async function connectToDB(): Promise<void> {
  await dataSource.initialize();
}
