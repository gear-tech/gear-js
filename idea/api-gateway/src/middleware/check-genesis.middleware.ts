import { Response, Request, NextFunction } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, META_STORAGE_METHODS } from '@gear-js/common';

import { getResponse } from '../utils';

const metaStorageMethods: string[] = Object.values(META_STORAGE_METHODS);

export async function checkGenesisMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

  if (Array.isArray(body)) {
    const isExistGenesis = body.every((value) => metaStorageMethods.includes(body.method) || value.params.genesis);

    if (!isExistGenesis) {
      return res.send(getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name));
    }
  } else {
    if (metaStorageMethods.includes(body.method)) {
      return next();
    }
    if (!body.params.genesis) {
      return res.send(getResponse(body, JSONRPC_ERRORS.NoGenesisFound.name));
    }
  }

  next();
}
