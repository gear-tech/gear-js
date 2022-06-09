import { IRpcRequest, IRpcResponse } from '@gear-js/interfaces';
import errors from '@gear-js/jsonrpc-errors';

import { requestMessageHandler } from '../json-rpc/handler';
import { getResponse, verifyCaptcha } from '../utils';

export const apiGatewayService = {
  async rpc(body: IRpcRequest): Promise<IRpcResponse | IRpcResponse[]> {
    if (Array.isArray(body)) {
      const testBalance = body.find((value) => value.method === 'testBalance.get');
      if (testBalance && !(await verifyCaptcha(testBalance.params.token))) {
        return getResponse(body, errors.Forbidden.name);
      }
    } else {
      if (body.method === 'testBalance.get' && !(await verifyCaptcha(body.params['token']))) {
        return getResponse(body, errors.Forbidden.name);
      }
    }
    const response = await requestMessageHandler(body);
    return response;
  },
};
