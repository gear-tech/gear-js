import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { jsonRpcHandler } from './json-rpc.handler';
import { dataStorageChannels, testBalanceChannels } from '../rabbitmq/init-rabbitmq';

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

  if(procedure.method === API_METHODS.NETWORK_DATA_AVAILABLE) {
    return getResponse(procedure, null, dataStorageChannels.has(params.genesis));
  }

  if (!validateGenesis(params.genesis)) {
    return getResponse(procedure, JSONRPC_ERRORS.InvalidParams.name);
  }

  const { error, result } = await jsonRpcHandler(method as API_METHODS, params);

  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const methods: string[] = [...Object.values(API_METHODS)];
  return methods.includes(kafkaTopic);
}

function validateGenesis(genesis: string): boolean {
  if(dataStorageChannels.has(genesis) || testBalanceChannels.has(genesis)){
    return true;
  }

  return false;
}
