import { NextFunction, Request, Response } from 'express';
import { IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';


export async function validateJsonRpcRequestMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

  if(Array.isArray(body)) {
    for(const request of body){
      if (!validateJsonRpcRequest(request)){
        res.send(createResponse(request));
        return;
      }
    }
  } else {
    if(!validateJsonRpcRequest(body)){
      res.send(createResponse(body));
      return;
    }
  }
  next();
}

function validateJsonRpcRequest(body: IRpcRequest): boolean {
  const { id, method, jsonrpc } = body;

  if(id && method && jsonrpc){
    return true;
  }

  return false;
}

function createResponse(requst: IRpcRequest){
  const response: any = {
    jsonrpc: '2.0',
  };
  const error = JSONRPC_ERRORS.InvalidParams.name;

  response['id'] = requst.id ? requst.id : null;
  response['error'] = {
    message: JSONRPC_ERRORS[error].message,
    code: JSONRPC_ERRORS[error].code
  };

  return response;
}


