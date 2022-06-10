import { IRpcRequest, IRpcResponse } from '@gear-js/interfaces';
import { JSONRPC_ERRORS } from '@gear-js/common';

export function getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse {
  const response: IRpcResponse = {
    jsonrpc: '2.0',
    id: procedure.id,
  };
  if (error) {
    response['error'] = { message: JSONRPC_ERRORS[error].message, code: JSONRPC_ERRORS[error].code };
  } else if (result) {
    response['result'] = result;
  }
  return response;
}
