import { NextFunction, Request, Response } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, logger } from '@gear-js/common';

export async function validateJsonRpcRequestMiddleware({ body }: Request, res: Response, next: NextFunction) {
  if (Array.isArray(body)) {
    for (const request of body) {
      if (!isValidRequestParams(request)) {
        return res.send(getInvalidParamsResponse(request));
      }
    }
  } else {
    if (!isValidRequestParams(body)) {
      return res.send(getInvalidParamsResponse(body));
    }
  }

  next();
}

const isValidRequestParams = ({ id, method, jsonrpc, params }: IRpcRequest): boolean =>
  !!id && !!method && !!jsonrpc && !!params;

function getInvalidParamsResponse(req: IRpcRequest) {
  logger.info('Invalid params error', { req });

  const error = JSONRPC_ERRORS.InvalidParams;

  return {
    jsonrpc: '2.0',
    id: req.id || null,
    error: {
      message: error.message,
      code: error.code,
    },
  };
}
