export interface IJsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: unknown[];
}

export interface IJsonRpcResponseOk<Result = unknown> {
  jsonrpc: '2.0';
  id: number;
  result: Result;
}

export interface IJsonRpcResponseError {
  jsonrpc: '2.0';
  id: number;
  error: {
    code: number;
    message: string;
    data?: string;
  };
}

export type IJsonRpcResponse<Result = unknown> = IJsonRpcResponseOk<Result> | IJsonRpcResponseError;
