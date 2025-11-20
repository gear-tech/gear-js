export interface IJsonRpcBase {
  jsonrpc: '2.0';
  id: number;
}

export interface IJsonRpcRequest extends IJsonRpcBase {
  method: string;
  params: unknown[];
}

export interface IJsonRpcResult<Result = unknown> extends IJsonRpcBase {
  result: Result;
}

export interface IJsonRpcResponseError extends IJsonRpcBase {
  error: {
    code: number;
    message: string;
    data?: string;
  };
}

export interface IJsonRpcSubscriptionMessage<Result = unknown> extends Omit<IJsonRpcBase, 'id'> {
  method: string;
  params: {
    subscription: number;
    result: Result;
  };
}

export type IJsonRpcMessage<Result = unknown> =
  | IJsonRpcResult<Result>
  | IJsonRpcResponseError
  | IJsonRpcSubscriptionMessage<Result>;
