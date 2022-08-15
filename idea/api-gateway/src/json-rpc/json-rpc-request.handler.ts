import { IRpcRequest, IRpcResponse, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import { getResponse, isValidGenesis } from '../utils';
import { API_GATEWAY } from '../common/constant';
import { jsonRpcHandler } from './json-rpc.handler';
import { API_JSON_RPC_METHODS } from '../common/api-json-rpc-methods';
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

  if (procedure.method === API_JSON_RPC_METHODS.TEST_BALANCE_AVAILABLE) {
    const { params: { genesis } } = procedure;
    return getResponse(procedure, null, isValidGenesis(genesis));
  }

  const { method, params } = procedure;
  const { error, result } = await jsonRpcHandler(method as KAFKA_TOPICS, params);
  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const methods: string[] = [...Object.values(API_JSON_RPC_METHODS)];
  return methods.includes(kafkaTopic);
}

export { jsonRpcRequestHandler };
