import { Response, Request, NextFunction } from 'express';
import { verify } from 'hcaptcha';

import config from '../config';

const SECRET = config.server.captchaSecret;

async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }
  if (process.env.TEST_ENV) {
    return true;
  }
  const verfied = await verify(SECRET, token);
  return verfied.success;
}

export function captchaMiddleware(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;

  verifyCaptcha(token).then((result) => {
    if (result) {
      next();
    } else {
      res.status(403).json({ error: 'Invalid captcha' });
    }
  });
}
