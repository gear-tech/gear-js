import { DataSource } from 'typeorm';

import config from '../config';
import { TransferBalance } from './transfer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port) || 5432,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: true,
  entities: [TransferBalance],
  migrations: [],
});

export async function connectToDB(): Promise<void> {
  await AppDataSource.initialize();
}
