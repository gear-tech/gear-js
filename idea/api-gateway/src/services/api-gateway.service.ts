import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse, verifyCaptcha } from '../utils';
import { jsonRpcRequestHandler } from '../json-rpc/json-rpc-request.handler';

export const apiGatewayService = {
  async rpc(body: IRpcRequest): Promise<IRpcResponse | IRpcResponse[]> {
    if (Array.isArray(body)) {
      const testBalance = body.find((value) => value.method === API_METHODS.TEST_BALANCE_GET);
      if (testBalance && !(await verifyCaptcha(testBalance.params.token))) {
        return getResponse(body, JSONRPC_ERRORS.Forbidden.name);
      }
    } else {
      if (body.method === API_METHODS.TEST_BALANCE_GET && !(await verifyCaptcha(body.params['token']))) {
        return getResponse(body, JSONRPC_ERRORS.Forbidden.name);
      }
    }
    return jsonRpcRequestHandler(body);
  },
};
