import { API_GATEWAY_METHODS, INDEXER_METHODS, META_STORAGE_METHODS, TEST_BALANCE_METHODS } from '../../enums/index.js';
import { IRpcResponse } from '../api-response.js';

export * from './indexer.js';
export * from './meta-storage.js';
export * from './test-balance.js';

export interface IRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: INDEXER_METHODS | META_STORAGE_METHODS | TEST_BALANCE_METHODS | API_GATEWAY_METHODS;
  params: any;
}

export interface IRpcRequestWithErrorAfterMiddleware {
  __error: IRpcResponse;
}

export type IRpcRequestAfterMiddleware = IRpcRequest | IRpcRequestWithErrorAfterMiddleware;
