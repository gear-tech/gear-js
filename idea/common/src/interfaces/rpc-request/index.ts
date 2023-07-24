import { API_GATEWAY_METHODS, INDEXER_METHODS, META_STORAGE_METHODS, TEST_BALANCE_METHODS } from '../../enums';

export * from './indexer';
export * from './meta-storage';
export * from './test-balance';

export interface IRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: INDEXER_METHODS | META_STORAGE_METHODS | TEST_BALANCE_METHODS | API_GATEWAY_METHODS;
  params: any;
}
