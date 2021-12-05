import ky from 'ky';
import { API_PATH } from 'consts';
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

type RPCSuccessResponse<Result> = PartialBy<_RPCResponse<Result | any>, 'error'>;
type RPCErrorResponse = PartialBy<_RPCResponse<undefined>, 'result'>;

type RPCResponse<Result> = RPCSuccessResponse<Result> | RPCErrorResponse;

export default class ServerRPCRequestService {
  protected readonly RPC_API_PATH = API_PATH;

  protected readonly url = this.RPC_API_PATH;

  private static generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  public async getResource<Result>(
    method: string = '',
    postParams: Object = {},
    headers: KyHeadersInit = {}
  ): Promise<RPCResponse<Result>> {
    const requestId = ServerRPCRequestService.generateRandomId();

    const chain = localStorage.getItem('chain') as string;

    const methodParams: RPCRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method,
      params: { ...postParams, chain },
    };

    return ky
      .post(this.url, {
        headers: { ...headers, 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(methodParams),
      })
      .json<RPCResponse<Result>>();
  }
}
