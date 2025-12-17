import ky, { Options } from 'ky';

import { INDEXER_API_URL, LocalStorage } from '@/shared/config';
import { generateRandomId } from '@/shared/helpers';

import { RPCError } from './RPCError';
import { RPCRequest, RPCResponse, RPCSuccessResponse } from './types';

type Headers = Options['headers'];
type Params = Record<string, unknown>;

class RPCService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private static getGenesis() {
    return localStorage.getItem(LocalStorage.Genesis) as string;
  }

  private getRequest(method: string, params: Params): RPCRequest {
    return {
      id: generateRandomId(),
      jsonrpc: '2.0',
      method,
      params: { ...params, genesis: RPCService.getGenesis() },
    };
  }

  private sendRequest<T>(request: RPCRequest, headers: Headers): Promise<RPCResponse<T>>;
  private sendRequest<T>(request: RPCRequest[], headers: Headers): Promise<RPCResponse<T>[]>;
  private sendRequest<T>(request: RPCRequest | RPCRequest[], headers: Headers) {
    return ky
      .post(this.url, {
        headers: { ...headers, 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(request),
        timeout: 30000,
      })
      .json<RPCResponse<T> | RPCResponse<T>[]>();
  }

  private checkError(response: RPCResponse<unknown>) {
    if ('error' in response && !('result' in response)) throw new RPCError(response);
  }

  public async callRPCBatch<T>(methods: string[], params: Params[] = [], headers: Headers = {}) {
    const requests = methods.map((method, index) => this.getRequest(method, params[index] ?? {}));
    const response = this.sendRequest<T>(requests, headers);
    const data = await response;

    data.forEach((item) => this.checkError(item));

    return Promise.resolve(data as RPCSuccessResponse<T>[]);
  }

  public async callRPC<T>(method = '', params: Params = {}, headers: Headers = {}) {
    const request = this.getRequest(method, params);
    const response = this.sendRequest<T>(request, headers);
    const data = await response;

    this.checkError(data);

    return Promise.resolve(data as RPCSuccessResponse<T>);
  }
}

const INDEXER_RPC_SERVICE = new RPCService(INDEXER_API_URL);

export { INDEXER_RPC_SERVICE };
