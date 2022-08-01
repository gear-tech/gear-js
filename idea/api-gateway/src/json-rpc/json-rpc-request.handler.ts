import { IRpcRequest, IRpcResponse, JSONRPC_ERRORS, KAFKA_TOPICS } from '@gear-js/common';

import { getResponse } from '../utils';
import { API_GATEWAY } from '../common/constant';
import { jsonRpcHandler } from './json-rpc.handler';
import { apiGatewayLogger } from '../common/event-listener.logger';
import { genesisHashesCollection } from '../common/genesis-hashes-collection';

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

  if (procedure.method === KAFKA_TOPICS.TEST_BALANCE_GET
      && genesisHashesCollection.has(procedure.params.genesis)) {
    const { params: { genesis } } = procedure;
    const genesisFromCollection = Array.from(genesisHashesCollection.values()).find(gen => gen === genesis);
    return getResponse(procedure, null, genesisFromCollection);
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
