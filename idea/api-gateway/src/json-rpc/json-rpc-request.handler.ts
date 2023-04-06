import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { jsonRpcHandler } from './json-rpc.handler';
import { indexerChannels, testBalanceChannels } from '../rabbitmq/init-rabbitmq';

export async function jsonRpcRequestHandler(
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
  const { method, params } = procedure;

  if (!isExistJsonRpcMethod(method)) {
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }

  if (method === API_METHODS.TEST_BALANCE_AVAILABLE) {
    return getResponse(procedure, null, testBalanceChannels.has(params.genesis));
  }

  if (procedure.method === API_METHODS.NETWORK_DATA_AVAILABLE) {
    return getResponse(procedure, null, indexerChannels.has(params.genesis));
  }

  if (!isValidGenesis(params.genesis, method)) {
    return getResponse(procedure, JSONRPC_ERRORS.UnknownNetwork.name);
  }

  const { error, result } = await jsonRpcHandler(method as API_METHODS, params);

  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const methods: string[] = [...Object.values(API_METHODS)];
  return methods.includes(kafkaTopic);
}

function isValidGenesis(genesis: string, method: string): boolean {
  if (method === API_METHODS.TEST_BALANCE_GET) {
    return testBalanceChannels.has(genesis);
  }
  return indexerChannels.has(genesis);
}
