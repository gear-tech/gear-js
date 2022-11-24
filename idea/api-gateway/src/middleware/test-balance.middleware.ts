import { Response, Request, NextFunction } from 'express';
import { API_METHODS, IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';

import { getResponse, verifyCaptcha } from '../utils';
import { isTestBalanceAvailable } from '../common/test-balance-genesis-collection';

async function verifyTestBalanceRequest(body: IRpcRequest) {
  if (body.method === API_METHODS.TEST_BALANCE_GET) {
    if (!body.params?.genesis || !isTestBalanceAvailable(body.params.genesis)) {
      return JSONRPC_ERRORS.TestBalanceIsUnavailable.name;
    }
    if (!body.params?.['token'] || !(await verifyCaptcha(body.params['token']))) {
      return JSONRPC_ERRORS.Forbidden.name;
    }
  }
  return null;
}

export async function testBalanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;
  if (Array.isArray(body)) {
    for (const request of body) {
      const error = await verifyTestBalanceRequest(request);
      if (error) {
        return res.send(getResponse(body, error));
      }
    }
  } else {
    const error = await verifyTestBalanceRequest(body);
    if (error) {
      return res.send(getResponse(body, error));
    }
  }
  next();
}
