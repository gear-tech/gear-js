import { NextFunction, Request, Response } from 'express';
import { IRpcRequest, JSONRPC_ERRORS, logger } from '@gear-js/common';

export async function validateJsonRpcRequestMiddleware({ body }: Request, res: Response, next: NextFunction) {
  if (Array.isArray(body)) {
    const batchResponse = [];
    if(body.length == 0) {
      return res.send(getInvalidRequestResponse(body));
    }
    
    for (const request of body) {
      if (typeof request !== 'object') {
        batchResponse.push(getInvalidRequestResponse(request));
      } else {
        if (!isValidRequestParams(request)) {
          batchResponse.push(getInvalidParamsResponse(request));
        }
      }
    }

    return res.send(batchResponse);
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

  const error = JSONRPC_ERRORS.InvalidParams.name;

  return {
    jsonrpc: '2.0',
    id: req.id || null,
    error: {
      message: JSONRPC_ERRORS[error].message,
      code: JSONRPC_ERRORS[error].code,
    },
  };
}

function getInvalidRequestResponse(req: any[]) {
  logger.info('Invalid request error', { req });

  const error = JSONRPC_ERRORS.InvalidRequest.name;

  return {
    jsonrpc: '2.0',
    id: null,
    error: {
      message: JSONRPC_ERRORS[error].message,
      code: JSONRPC_ERRORS[error].code,
    },
  };
}


