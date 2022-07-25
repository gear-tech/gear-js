import { IRpcRequest, IRpcResponse, KAFKA_TOPICS, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { API_GATEWAY } from '../common/constant';
import { jsonRpcHandler } from './json-rpc.handler';
import { apiGatewayLogger } from '../common/event-listener.logger';

async function jsonRpcRequestHandler(
  rpcBodyRequest: IRpcRequest | IRpcRequest[],
): Promise<IRpcResponse | IRpcResponse[]> {
  if (Array.isArray(rpcBodyRequest)) {
    const promises = rpcBodyRequest.map((rpcBody) => {
      return executeProcedure(rpcBody);
    });
    const result = await Promise.all(promises);
    return result;
  } else {
    return executeProcedure(rpcBodyRequest);
  }
}

async function executeProcedure(procedure: IRpcRequest): Promise<IRpcResponse> {
  if (!isExistJsonRpcMethod(procedure.method)) {
    apiGatewayLogger.error(`${API_GATEWAY}:${JSON.stringify(JSONRPC_ERRORS.MethodNotFound)}`);
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }
  const { method, params } = procedure;
  const { error, result } = await jsonRpcHandler(method as KAFKA_TOPICS, params);
  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const topics: string[] = Object.values(KAFKA_TOPICS);
  return topics.includes(kafkaTopic);
}

export { jsonRpcRequestHandler };
