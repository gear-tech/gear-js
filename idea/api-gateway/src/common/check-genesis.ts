import { IRpcRequest, IRpcResponse, JSONRPC_ERRORS } from '@gear-js/common';
import { getResponse } from '../utils';

export function checkGenesis(body: IRpcRequest): void | IRpcResponse {
  if (Array.isArray(body)) {
    const isExistGenesis = body.every((value) => value.params.genesis);

    if (!isExistGenesis) {
      return getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name);
    }
  } else {
    if (!body.params.genesis) {
      return getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name);
    }
  }
}
