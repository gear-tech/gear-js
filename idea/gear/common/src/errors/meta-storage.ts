import { GearJsonRPCError } from './base.js';
import { JSONRPC_ERRORS } from './jsonrpc-errors.js';

export class MetaNotFoundError extends GearJsonRPCError {
  name = JSONRPC_ERRORS.MetadataNotFound.name;
}

export class InvalidMetadataError extends GearJsonRPCError {
  name = JSONRPC_ERRORS.InvalidMetaHex.name;
}

export class SailsIdlNotFoundError extends GearJsonRPCError {
  name = JSONRPC_ERRORS.SailsIdlNotFound.name;
}
