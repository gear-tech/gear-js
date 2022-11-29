import { IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

export function getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse {
  const response: IRpcResponse = {
    jsonrpc: '2.0',
    id: procedure.id,
  };

  if (error || result === undefined) {
    if (!JSONRPC_ERRORS[error]) {
      error = 'InternalError';
      console.log('Internal error on request', procedure);
    }
    response['error'] = { message: JSONRPC_ERRORS[error].message, code: JSONRPC_ERRORS[error].code };
  } else {
    response['result'] = result;
  }
  return response;
}
