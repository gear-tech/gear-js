import { Response, Request, NextFunction } from 'express';
import { API_METHODS, IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse, verifyCaptcha } from '../utils';

export async function testBalanceMiddleware(req: Request, res: Response, next: NextFunction){
  const body: IRpcRequest = req.body;

  if(Array.isArray(body)) {
    const testBalance = body.find((value) => value.method === API_METHODS.TEST_BALANCE_GET);

    if (testBalance && !(await verifyCaptcha(testBalance.params.token))) {
      res.send(getResponse(body, JSONRPC_ERRORS.Forbidden.name));
    }
  } else {
    if (body.method === API_METHODS.TEST_BALANCE_GET && !(await verifyCaptcha(body.params['token']))) {
      res.send(getResponse(body, JSONRPC_ERRORS.Forbidden.name));
    }
  }
  next();
}
