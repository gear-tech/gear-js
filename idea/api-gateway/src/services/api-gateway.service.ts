import { IRpcRequest, IRpcResponse } from '@gear-js/common';

import { jsonRpcRequestHandler } from '../json-rpc/json-rpc-request.handler';

export const apiGatewayService = {
  async rpc(body: IRpcRequest): Promise<IRpcResponse | IRpcResponse[]> {
    return jsonRpcRequestHandler(body);
  },
};
