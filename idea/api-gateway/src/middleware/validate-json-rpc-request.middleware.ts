import { NextFunction, Request, Response } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, logger } from '@gear-js/common';

export async function validateJsonRpcRequestMiddleware({ body }: Request, res: Response, next: NextFunction) {
  if (Array.isArray(body)) {
    if (body.length === 0) {
      return res.send(getInvalidRequestResponse(null));
    }
    for (let i = 0; i < body.length; i++) {
      if (!isValidRequestParams(body[i])) {
        body[i] = { __error: getInvalidRequestResponse(body[i]) };
      }
    }
  } else {
    if (!isValidRequestParams(body)) {
      return res.send(getInvalidRequestResponse(body));
    }
  }

  next();
}

const isValidRequestParams = ({ id, method, jsonrpc, params }: IRpcRequest): boolean =>
  !!id && !!method && !!jsonrpc && !!params;

function getInvalidRequestResponse(req: IRpcRequest) {
  logger.info('Invalid request error', { req });

  const error = JSONRPC_ERRORS.InvalidRequest;

  return {
    jsonrpc: '2.0',
    id: req?.id || null,
    error: {
      message: error.message,
      code: error.code,
    },
  };
}
