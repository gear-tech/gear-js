import { Response, Request, NextFunction } from 'express';
import { verify } from 'hcaptcha';

import config from '../../config';

const SECRET = config.server.captchaSecret;

async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  const verfied = await verify(SECRET, token);

  return verfied.success;
}

export function captchaMiddleware({ body: { token } }: Request, res: Response, next: NextFunction) {
  verifyCaptcha(token).then((result) => {
    if (result) {
      next();
    } else {
      res.status(403).json({ error: 'Invalid captcha' });
    }
  });
}
