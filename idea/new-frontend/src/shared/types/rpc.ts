enum JSONRPCErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

type JsonRpcVersion = '2.0';

type JsonRpcId = number | string | void;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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

type RPCServerResponse<Result> = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion;
  result: Result;
  error: RPCError;
};

type RPCErrorResponse = PartialBy<RPCServerResponse<undefined>, 'result'>;
type RPCSuccessResponse<Result> = PartialBy<RPCServerResponse<Result>, 'error'>;

type RPCResponse<Result> = RPCSuccessResponse<Result> | RPCErrorResponse;

export type { RPCRequest, RPCResponse, RPCErrorResponse, RPCSuccessResponse, JSONRPCErrorCode };
