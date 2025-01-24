import { DataSource } from 'typeorm';
import { Code, Event, MessageFromProgram, MessageToProgram, Program, Voucher } from './entities';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const createDbConnection = async ({ host, port, username, password, database }: DbConfig) => {
  const dataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Code, Program, MessageToProgram, MessageFromProgram, Event, Voucher],
    synchronize: false,
    migrationsRun: false,
    logging: ['error', 'schema', 'migration'],
  });

  await dataSource.initialize();

  return dataSource;
};
