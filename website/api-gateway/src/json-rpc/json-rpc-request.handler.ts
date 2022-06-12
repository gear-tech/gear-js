import { IRpcRequest, IRpcResponse, logger, KAFKA_TOPICS, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { API_GATEWAY } from '../common/constant';
import { jsonRpcMethodHandler } from './json-rpc-method.handler';

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
    logger.error(`${API_GATEWAY}:${JSON.stringify(JSONRPC_ERRORS.MethodNotFound)}`);
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }
  const { method, params } = procedure;
  const { error, result } = await jsonRpcMethodHandler(method, params);
  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const topics: string[] = Object.values(KAFKA_TOPICS);
  return topics.includes(kafkaTopic);
}

export { jsonRpcRequestHandler };
