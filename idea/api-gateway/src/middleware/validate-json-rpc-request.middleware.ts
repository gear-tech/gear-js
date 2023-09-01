import { NextFunction, Request, Response } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, logger } from '@gear-js/common';

export async function validateJsonRpcRequestMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

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

function isValidRequestParams({ id, method, jsonrpc, params }: IRpcRequest): boolean {
  return !!id && !!method && !!jsonrpc && !!params;
}

function getInvalidParamsResponse(req: IRpcRequest) {
  logger.info('Invalid params error', { req });
  const response: any = {
    jsonrpc: '2.0',
  };
  const error = JSONRPC_ERRORS.InvalidParams.name;

  response['id'] = req.id ? req.id : null;
  response['error'] = {
    message: JSONRPC_ERRORS[error].message,
    code: JSONRPC_ERRORS[error].code,
  };

  return response;
}
