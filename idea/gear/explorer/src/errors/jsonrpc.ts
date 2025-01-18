import { JsonRpcError } from '../types';

export class MethodNotFound implements JsonRpcError {
  code = -32601;
  message = 'Method not found';
}

export class InvalidParams implements JsonRpcError {
  code = -32602;
  message = 'Invalid params';
  data = undefined;

  constructor(details?: string) {
    if (details) {
      this.data = details;
    }
  }
}

export class InternalError implements JsonRpcError {
  code = -32603;
  message = 'Internal error';
  data = undefined;

  constructor(details?: string) {
    if (details) {
      this.data = details;
    }
  }
}
