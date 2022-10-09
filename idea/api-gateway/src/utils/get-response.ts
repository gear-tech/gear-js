import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { isJsonRpcAvailableMethod } from './is-json-rpc-available-method';

export function getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse {
  const response: IRpcResponse = {
    jsonrpc: '2.0',
    id: procedure.id,
  };

  if (error) {
    if (!JSONRPC_ERRORS[error]) {
      error = 'InternalError';
      console.log(error);
    }
    response['error'] = { message: JSONRPC_ERRORS[error].message, code: JSONRPC_ERRORS[error].code };
  } else if (result || isJsonRpcAvailableMethod(procedure.method as API_METHODS)) {
    response['result'] = result;
  }
  return response;
}
