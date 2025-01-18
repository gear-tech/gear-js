export interface JsonRpcRequest<T = any> {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: T;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

export interface JsonRpcResponseError {
  jsonrpc: '2.0';
  id: number;
  error: JsonRpcError;
}

export interface JsonRpcResponseResult<T> {
  jsonrpc: '2.0';
  id: number;
  result: T;
}

export type JsonRpcResponse<T = any> = JsonRpcResponseError | JsonRpcResponseResult<T>;
