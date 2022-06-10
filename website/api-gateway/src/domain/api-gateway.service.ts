import { IRpcRequest, IRpcResponse, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import { requestMessageHandler } from '../json-rpc/handler';
import { getResponse, verifyCaptcha } from '../utils';

export const apiGatewayService = {
  async rpc(body: IRpcRequest): Promise<IRpcResponse | IRpcResponse[]> {
    if (Array.isArray(body)) {
      const testBalance = body.find((value) => value.method === KAFKA_TOPICS.TEST_BALANCE_GET);
      if (testBalance && !(await verifyCaptcha(testBalance.params.token))) {
        return getResponse(body, JSONRPC_ERRORS.Forbidden.name);
      }
    } else {
      if (body.method === KAFKA_TOPICS.TEST_BALANCE_GET && !(await verifyCaptcha(body.params['token']))) {
        return getResponse(body, JSONRPC_ERRORS.Forbidden.name);
      }
    }
    const response = await requestMessageHandler(body);
    return response;
  },
};
