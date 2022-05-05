import { verify } from 'hcaptcha';
import configuration from './config/configuration';
import errors from '@gear-js/jsonrpc-errors';
import { IRpcRequest, IRpcResponse } from './json-rpc/interface';
const config = configuration();

const SECRET = config.server.captchaSecret;

export async function verifyCaptcha(token: string) {
  const verfied = await verify(SECRET, token);
  if (verfied.success) {
    return true;
  }
  return false;
}

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
