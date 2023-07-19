import { Response, Request, NextFunction } from 'express';
import { TEST_BALANCE_METHODS, IRpcRequest, JSONRPC_ERRORS } from '@gear-js/common';
import { verify } from 'hcaptcha';

import config from '../config';
import { getResponse } from '../utils';

const SECRET = config.server.captchaSecret;

async function verifyCaptcha(token: string) {
  if (!token) {
    return false;
  }
  if (process.env.TEST_ENV) {
    return true;
  }
  const verfied = await verify(SECRET, token);
  if (verfied.success) {
    return true;
  }
  return false;
}

export async function captchaMiddleware(req: Request, res: Response, next: NextFunction) {
  const body: IRpcRequest = req.body;

  if (Array.isArray(body)) {
    for (const request of body) {
      if (body.method === TEST_BALANCE_METHODS.TEST_BALANCE_GET && !(await verifyCaptcha(request.params['token']))) {
        return res.send(getResponse(body, JSONRPC_ERRORS.Forbidden.name));
      }
    }
  } else {
    if (body.method === TEST_BALANCE_METHODS.TEST_BALANCE_GET) {
      if (!(await verifyCaptcha(body.params['token']))) {
        return res.send(getResponse(body, JSONRPC_ERRORS.Forbidden.name));
      }
    }
  }

  return next();
}
