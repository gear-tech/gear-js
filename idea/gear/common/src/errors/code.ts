import { GearJsonRPCError } from './base';
import { JSONRPC_ERRORS } from './jsonrpc-errors';

export class CodeNotFound extends GearJsonRPCError {
  name = JSONRPC_ERRORS.CodeNotFound.name;
}
