import { DataSource } from 'typeorm';

import {
  Code,
  Dns,
  DnsEvent,
  DnsProgram,
  Event,
  MessageFromProgram,
  MessageToProgram,
  Program,
  Voucher,
} from './entities/index.js';

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
    entities: [Code, Program, MessageToProgram, MessageFromProgram, Event, Voucher, DnsProgram, DnsEvent, Dns],
    synchronize: false,
    migrationsRun: false,
    logging: ['error', 'schema', 'migration'],
    poolSize: 10,
    extra: {
      options: '-c random_page_cost=1.1',
    },
  });

  await dataSource.initialize();

  return dataSource;
};
