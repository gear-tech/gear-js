export const JSONRPC_ERRORS = {
  MethodNotFound: {
    name: 'MethodNotFound',
    code: -32601,
    message: 'Method not found',
  },
  InvalidParams: {
    name: 'InvalidParams',
    code: -32602,
    message: 'Invalid params',
  },
  InvalidProgramMetaHex: {
    name: 'InvalidProgramMetaHex',
    code: -32602,
    message: 'Invalid program meta hex',
  },
  InvalidCodeMetaHex: {
    name: 'InvalidCodeMetaHex',
    code: -32602,
    message: 'Invalid code meta hex',
  },
  CodeDoNotHaveMeta: {
    name: 'CodeDoNotHaveMeta',
    code: -32602,
    message: 'Code do not have meta',
  },
  ProgramDoNotHaveMeta: {
    name: 'ProgramDoNotHaveMeta',
    code: -32602,
    message: 'Program do not have meta',
  },
  InternalError: {
    name: 'InternalError',
    code: -32603,
    message: 'Internal error',
  },
  TransferLimitReached: {
    name: 'TransferLimitReached',
    code: -32604,
    message: 'Limit to transfer balance is reached for today',
  },
  TestBalanceIsUnavailable: {
    name: 'TestBalanceIsUnavailable',
    code: -32605,
    message: 'Service for getting a test balance is unavailable on this network',
  },
  NoGenesisFound: {
    name: 'NoGenesisFound',
    code: -32605,
    message: 'Genesis not found in the request',
  },
  ServiceIsNotAvaiable: {
    name: 'ServiceIsNotAvaiable',
    code: -32500,
    message: 'Service is not available',
  },
  UnableToGetData: {
    name: 'UnableToGetData',
    code: -32001,
    message: 'Unable to get data from service',
  },
  MessageNotFound: {
    name: 'MessageNotFound',
    code: -32404,
    message: 'Message not found',
  },
  MetadataNotFound: {
    name: 'MetadataNotFound',
    code: -32404,
    message: 'Metadata not found',
  },
  ProgramNotFound: {
    name: 'ProgramNotFound',
    code: -32404,
    message: 'Program not found',
  },
  StateNotFound: {
    name: 'StateNotFound',
    code: -32404,
    message: 'State not found',
  },
  SignatureNotVerified: {
    name: 'SignatureNotVerified',
    code: -32403,
    message: 'Signature not verified',
  },
  StateAlreadyExists: {
    name: 'StateAlreadyExists',
    code: -32400,
    message: 'State already exists',
  },
  Forbidden: {
    name: 'Forbidden',
    code: -32403,
    message: 'Forbidden',
  },
};
