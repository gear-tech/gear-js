import ky, { Options } from 'ky';

import { generateRandomId } from '@/shared/helpers';
import { INDEXER_API_URL, LocalStorage } from '@/shared/config';

import { RPCError } from './RPCError';
import { RPCRequest, RPCResponse, RPCSuccessResponse } from './types';

class RPCService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private static getGenesis() {
    return localStorage.getItem(LocalStorage.Genesis) as string;
  }

  private getRequest(method: string, postParams: object): RPCRequest {
    return {
      id: generateRandomId(),
      jsonrpc: '2.0',
      method,
      params: {
        ...postParams,
        genesis: RPCService.getGenesis(),
      },
    };
  }

  public async callRPC<Result>(method = '', postParams = {}, headers: Options['headers'] = {}) {
    const response = ky
      .post(this.url, {
        headers: { ...headers, 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(this.getRequest(method, postParams)),
        timeout: 30000,
      })
      .json<RPCResponse<Result>>();

    const data = await response;

    if ('error' in data && !('result' in data)) {
      throw new RPCError(data);
    }

    return Promise.resolve(data as RPCSuccessResponse<Result>);
  }
}

const INDEXER_RPC_SERVICE = new RPCService(INDEXER_API_URL);

export { INDEXER_RPC_SERVICE };
