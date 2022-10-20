import { Response, Request, NextFunction } from 'express';
import { IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';
import { servicesPartitionMap } from '../common/services-partition-map';

export async function checkGenesisMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

  if(Array.isArray(body)) {
    const isExistGenesis = body.every((value) => 'genesis' in value
      && value.genesis
      && servicesPartitionMap.has(value.genesis));

    if (!isExistGenesis) {
      res.send(getResponse(body, JSONRPC_ERRORS.InvalidParams.name));
      return;
    }
  } else {
    if (!('genesis' in body.params && body.params.genesis && servicesPartitionMap.has(body.params.genesis))) {
      res.send(getResponse(body, JSONRPC_ERRORS.InvalidParams.name));
      return;
    }
  }
  next();
}
