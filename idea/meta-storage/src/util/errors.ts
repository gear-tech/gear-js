import { JSONRPC_ERRORS } from '@gear-js/common';

export class MetaNotFoundError extends Error {
  name = JSONRPC_ERRORS.MetadataNotFound.name;
}

export class InvalidMetadataError extends Error {
  name = JSONRPC_ERRORS.InvalidMetaHex.name;
}

export class InvalidParamsError extends Error {
  name = JSONRPC_ERRORS.InvalidParams.name;
}

export class SailsIdlNotFoundError extends Error {
  name = JSONRPC_ERRORS.SailsIdlNotFound.name;
}
