import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
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
} from '@vara-eth/indexer-db';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    throw new Error('DB_URL environment variable is required');
  }

  return {
    type: 'postgres',
    url: dbUrl,
    entities: [
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
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  };
}
