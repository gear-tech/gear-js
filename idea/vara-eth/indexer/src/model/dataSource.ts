import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import {
  Batch,
  Code,
  EthereumTx,
  HashRegistry,
  MessageRequest,
  MessageSent,
  Program,
  ReplyRequest,
  ReplySent,
  StateTransition,
} from './entities/index.js';

dotenv.config({ quiet: true });

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
