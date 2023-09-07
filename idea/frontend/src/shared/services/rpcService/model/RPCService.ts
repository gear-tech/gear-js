import ky from 'ky';
import { KyHeadersInit } from 'ky/distribution/types/options';

import { generateRandomId } from 'shared/helpers';
import { API_URL, LocalStorage } from 'shared/config';

import { RPCError } from './RPCError';
import { RPCRequest, RPCResponse, RPCSuccessResponse } from './types';

class RPCService {
  protected readonly url = API_URL;

  private static getGenesis() {
    return localStorage.getItem(LocalStorage.Genesis) as string;
  }

  // eslint-disable-next-line class-methods-use-this
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

  public async callRPC<Result>(method = '', postParams: Object = {}, headers: KyHeadersInit = {}) {
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

const rpcService = new RPCService();

export { rpcService, RPCService };
