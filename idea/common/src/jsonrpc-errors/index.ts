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
  SignatureNotVerified: {
    name: 'SignatureNotVerified',
    code: -32403,
    message: 'Signature not verified',
  },
  Forbidden: {
    name: 'Forbidden',
    code: -32403,
    message: 'Forbidden',
  },
};
