import { GearJsonRPCError } from './base.js';
import { JSONRPC_ERRORS } from './jsonrpc-errors.js';

export class CodeNotFound extends GearJsonRPCError {
  name = JSONRPC_ERRORS.CodeNotFound.name;
}
