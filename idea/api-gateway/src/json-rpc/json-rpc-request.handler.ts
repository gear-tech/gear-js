import { API_METHODS, IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { jsonRpcHandler } from './json-rpc.handler';
import { isValidGenesis } from '../common/genesis-hashes-collection';

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
  const { method, params } = procedure;

  if (!isExistJsonRpcMethod(method)) {
    return getResponse(procedure, JSONRPC_ERRORS.MethodNotFound.name);
  }

  if (method === API_METHODS.TEST_BALANCE_AVAILABLE) {
    return getResponse(procedure, null, isValidGenesis(params.genesis));
  }

  const { error, result } = await jsonRpcHandler(method as API_METHODS, params);
  return getResponse(procedure, error, result);
}

function isExistJsonRpcMethod(kafkaTopic: string): boolean {
  const methods: string[] = [...Object.values(API_METHODS)];
  return methods.includes(kafkaTopic);
}

export { jsonRpcRequestHandler };
