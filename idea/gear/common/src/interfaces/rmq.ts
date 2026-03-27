import { INDEXER_METHODS, META_STORAGE_METHODS, TEST_BALANCE_METHODS } from '../enums/index.js';

export interface RMQMessage {
  correlationId: string;
  params: unknown;
  genesis: string;
  method: INDEXER_METHODS | META_STORAGE_METHODS | TEST_BALANCE_METHODS;
}

export interface RMQReply {
  result?: any;
  error?: any;
}
