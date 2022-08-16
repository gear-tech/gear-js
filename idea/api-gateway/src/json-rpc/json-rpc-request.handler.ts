import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse, isValidGenesis } from '../utils';
import { API_GATEWAY } from '../common/constant';
import { jsonRpcHandler } from './json-rpc.handler';
import { apiGatewayLogger } from '../common/api-gateway.logger';

async function jsonRpcRequestHandler(
  rpcBodyRequest: IRpcRequest | IRpcRequest[],
): Promise<IRpcResponse | IRpcResponse[]> {
  if (Array.isArray(rpcBodyRequest)) {
    const promises = rpcBodyRequest.map((rpcBody) => {
      return executeProcedure(rpcBody);
    });
    return Promise.all(promises);
  } else {
    return executeProcedure(rpcBodyRequest);
  }
}

async function executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse> {
  if (!isExistJsonRpcMethod(procedure.method)) {
    apiGatewayLogger.error(`${API_GATEWAY}:${JSON.stringify(JSONRPC_ERRORS.MethodNotFound)}`);
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }

  if (procedure.method === API_METHODS.TEST_BALANCE_AVAILABLE) {
    const { params: { genesis } } = procedure;
    return getResponse(procedure, null, isValidGenesis(genesis));
  }

  const { method, params } = procedure;
  const { error, result } = await jsonRpcHandler(method as API_METHODS, params);
  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const methods: string[] = [...Object.values(API_METHODS)];
  return methods.includes(kafkaTopic);
}

export { jsonRpcRequestHandler };
