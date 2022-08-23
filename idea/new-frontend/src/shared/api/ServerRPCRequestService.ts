// eslint-disable-next-line max-classes-per-file
import ky from 'ky';
import { KyHeadersInit } from 'ky/distribution/types/options';

import { API_URL, LocalStorage } from 'shared/config';
import { generateRandomId } from 'shared/helpers';
import { RPCRequest, RPCResponse, RPCSuccessResponse, RPCErrorResponse } from 'shared/types/rpc';

class RPCResponseError extends Error {
  code;

  constructor(err: RPCErrorResponse) {
    super();
    this.message = err.error.message;
    this.code = err.error.code;
    this.name = 'RPCResponseError';
  }
}

class ServerRPCRequestService {
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
        genesis: ServerRPCRequestService.getGenesis(),
      },
    };
  }

  public async callRPC<Result>(method = '', postParams: Object = {}, headers: KyHeadersInit = {}) {
    const response = ky
      .post(this.url, {
        headers: { ...headers, 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(this.getRequest(method, postParams)),
      })
      .json<RPCResponse<Result>>();

    const data = await response;

    if ('error' in data && !('result' in data)) {
      throw new RPCResponseError(data);
    }

    return Promise.resolve(data as RPCSuccessResponse<Result>);
  }
}

export { ServerRPCRequestService };
