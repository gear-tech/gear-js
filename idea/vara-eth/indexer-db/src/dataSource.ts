import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import {
  Batch,
  Code,
  EthereumTx,
  HashRegistry,
  InjectedTransaction,
  MessageRequest,
  MessageSent,
  Program,
  ReplyRequest,
  ReplySent,
  StateTransition,
} from './entities/index.js';

dotenv.config({ quiet: true, path: ['.env', '../.env', '../../../.env'] });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Code,
    Batch,
    HashRegistry,
    InjectedTransaction,
    Program,
    StateTransition,
    EthereumTx,
    MessageRequest,
    MessageSent,
    ReplyRequest,
    ReplySent,
  ],
  migrations: ['db/migrations/*.js'],
});

export default AppDataSource;
