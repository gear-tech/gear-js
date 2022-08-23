export enum JSONRPCErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

type JsonRpcVersion = '2.0';

type JsonRpcId = number | string | void;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RPCError = {
  code: string | JSONRPCErrorCode;
  message: string;
  data: string;
};

type RPCServerResponse<Result> = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion;
  result: Result;
  error: RPCError;
};

export type RPCErrorResponse = PartialBy<RPCServerResponse<undefined>, 'result'>;
export type RPCSuccessResponse<Result> = PartialBy<RPCServerResponse<Result>, 'error'>;

export type RPCRequest = {
  jsonrpc: JsonRpcVersion;
  method: string;
  id?: JsonRpcId;
  params?: Object;
};

export type RPCResponse<Result> = RPCSuccessResponse<Result> | RPCErrorResponse;
