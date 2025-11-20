import {
  IJsonRpcRequest,
  IJsonRpcMessage,
  IJsonRpcResponseError,
  IJsonRpcSubscriptionMessage,
  IJsonRpcResult,
} from '../types/index.js';

function generateId(): number {
  return Math.floor(Math.random() * 1_000_000);
}

export function createJsonRpcRequest(method: string, parameters: unknown[], id?: number): IJsonRpcRequest {
  return { method, params: parameters.map(transformBigint), id: id ?? generateId(), jsonrpc: '2.0' };
}

export function isErrorMessage(response: IJsonRpcMessage): response is IJsonRpcResponseError {
  return 'error' in response;
}

export function isResultMessage(response: IJsonRpcMessage): response is IJsonRpcResult {
  return 'result' in response;
}

export function isSubscriptionMessage(response: IJsonRpcMessage): response is IJsonRpcSubscriptionMessage {
  if ('params' in response && 'subscription' in response.params) {
    return true;
  }
  return false;
}

export function getErrorMessage(response: IJsonRpcResponseError) {
  let error = `RpcError(${response.error.code}): ${response.error.message}`;

  if (response.error.data) {
    error += ` :: ${response.error.data}`;
  }

  return error;
}

function transformBigint(object: unknown): unknown {
  if (typeof object === 'bigint') {
    return Number(object);
  } else if (Array.isArray(object)) {
    return object.map((item) => transformBigint(item));
  } else if (object !== null && typeof object === 'object') {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transformBigint(value)]));
  }
  return object;
}
