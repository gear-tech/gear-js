import { Response, Request, NextFunction } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, META_STORAGE_METHODS } from '@gear-js/common';

import { getResponse } from '../utils';

const metaStorageMethods: string[] = Object.values(META_STORAGE_METHODS);

export async function checkGenesisMiddleware(
  { body }: Request<any, any, IRpcRequest>,
  res: Response,
  next: NextFunction,
) {
  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i++) {
      if (metaStorageMethods.includes(body[i].method) || body[i]?.__error) {
        continue;
      }

      if (!body[i]?.params?.genesis) {
        body[i] = { __error: getResponse(body[i], JSONRPC_ERRORS.NoGenesisFound.name) };
      }
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
