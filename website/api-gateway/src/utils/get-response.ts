import errors from '@gear-js/jsonrpc-errors';
import { IRpcRequest, IRpcResponse } from '@gear-js/interfaces';

export function getResponse(procedure: IRpcRequest, error?: any, result?: any): IRpcResponse {
  const response: IRpcResponse = {
    jsonrpc: '2.0',
    id: procedure.id,
  };
  if (error) {
    response['error'] = { message: errors[error].message, code: errors[error].code };
  } else if (result) {
    response['result'] = result;
  }
  return response;
}
