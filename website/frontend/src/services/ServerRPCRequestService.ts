// eslint-disable-next-line max-classes-per-file
import ky from 'ky';
import { API_URL, LOCAL_STORAGE } from 'consts';
import { KyHeadersInit } from 'ky/distribution/types/options';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type JsonRpcVersion = '2.0';

type JsonRpcId = number | string | void;

export enum JSONRPCErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

type RPCRequest = {
  jsonrpc: JsonRpcVersion;
  method: string;
  id?: JsonRpcId;
  params?: Object;
};

type RPCError = {
  code: string | JSONRPCErrorCode;
  message: string;
  data: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type _RPCResponse<Result> = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion;
  result: Result;
  error: RPCError;
};

type RPCSuccessResponse<Result> = PartialBy<_RPCResponse<Result>, 'error'>;
type RPCErrorResponse = PartialBy<_RPCResponse<undefined>, 'result'>;

type RPCResponse<Result> = RPCSuccessResponse<Result> | RPCErrorResponse;

export class RPCResponseError extends Error {
  code;

  constructor(err: RPCErrorResponse) {
    super();
    this.message = err.error.message;
    this.code = err.error.code;
    this.name = 'RPCResponseError';
  }
}

export type RPCResponseErrorType = typeof RPCResponseError;

export default class ServerRPCRequestService {
  protected readonly RPC_API_PATH = API_URL;

  protected readonly url = this.RPC_API_PATH;

  private static generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  private static getRequestId() {
    return ServerRPCRequestService.generateRandomId();
  }

  private static getGenesis() {
    return localStorage.getItem(LOCAL_STORAGE.GENESIS) as string;
  }

  private getRequest(method: string, postParams: object): RPCRequest {
    return {
      jsonrpc: '2.0',
      id: ServerRPCRequestService.getRequestId(),
      method,
      params: {
        ...postParams,
        genesis: ServerRPCRequestService.getGenesis(),
      },
    };
  }

  public async callRPC<Result>(method: string = '', postParams: Object = {}, headers: KyHeadersInit = {}) {
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
