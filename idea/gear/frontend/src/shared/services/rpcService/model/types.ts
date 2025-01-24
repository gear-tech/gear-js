import { RPCErrorCode, RPC_VERSION } from './consts';

type JsonRpcId = number | string;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RPCError = {
  code: RPCErrorCode | number;
  data: string;
  message: string;
};

type RPCServerResponse<Result> = {
  id: JsonRpcId;
  jsonrpc: typeof RPC_VERSION;
  result: Result;
  error: RPCError;
};

type RPCErrorResponse = PartialBy<RPCServerResponse<undefined>, 'result'>;
type RPCSuccessResponse<Result> = PartialBy<RPCServerResponse<Result>, 'error'>;

type RPCRequest = {
  id?: JsonRpcId;
  method: string;
  params?: object;
  jsonrpc: typeof RPC_VERSION;
};

type RPCResponse<Result> = RPCSuccessResponse<Result> | RPCErrorResponse;

export type { RPCRequest, RPCResponse, RPCErrorResponse, RPCSuccessResponse };
