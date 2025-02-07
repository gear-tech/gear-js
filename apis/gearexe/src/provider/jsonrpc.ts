import { IJsonRpcRequest, IJsonRpcResponse, IJsonRpcResponseError } from '../types/index.js';

function id(): number {
  return Math.floor(Math.random() * 1_000_000);
}

export function encodeJsonRpc(method: string, parameters: unknown[]): IJsonRpcRequest {
  return { method, params: parameters.map(transformBigint), id: id(), jsonrpc: '2.0' };
}

export function isErrorResponse(response: IJsonRpcResponse): response is IJsonRpcResponseError {
  return 'error' in response;
}

export function getErrorMessage(response: IJsonRpcResponseError) {
  let error = `RpcError(${response.error.code}): ${response.error.message}`;

  if (response.error.data) {
    error += ` :: ${response.error.data}`;
  }

  return error;
}

function transformBigint(object: unknown) {
  if (typeof object === 'bigint') {
    return Number(object);
  } else if (Array.isArray(object)) {
    return object.map(transformBigint(object));
  } else if (object !== null && typeof object === 'object') {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transformBigint(value)]));
  }
  return object;
}
