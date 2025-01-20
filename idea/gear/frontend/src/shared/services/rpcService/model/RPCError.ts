import { RPCErrorResponse } from './types';

class RPCError extends Error {
  code;

  constructor(err: RPCErrorResponse) {
    super();
    this.message = err.error.message;
    this.code = err.error.code;
    this.name = 'RPCResponseError';
  }
}

export { RPCError };
