import { JSONRPC_ERRORS } from './jsonrpc-errors';

export class GearJsonRPCError extends Error {
  name = 'GearJsonRPCError';

  constructor(data?: string) {
    super(data);
  }
}

export class InvalidParamsError extends GearJsonRPCError {
  name = JSONRPC_ERRORS.InvalidParams.name;
}
