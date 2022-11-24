import { Response, Request, NextFunction } from 'express';
import { IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse } from '../utils';

export async function checkGenesisMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

  if (Array.isArray(body)) {
    const isExistGenesis = body.every((value) => value.params.genesis);

    if (!isExistGenesis) {
      res.send(getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name));
      return;
    }
  } else {
    if (!body.params.genesis) {
      res.send(getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name));
      return;
    }
  }

  next();
}
