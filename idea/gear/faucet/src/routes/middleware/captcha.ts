import { Response, Request, NextFunction } from 'express';
import { verify } from 'hcaptcha';

import config from '../../config';
import { logger } from 'gear-idea-common';

const SECRET = config.server.captchaSecret;

async function verifyCaptcha(token: string): Promise<boolean> {
  logger.debug('verify captcha', { token });
  if (!token) {
    return false;
  }

  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  const verifResponse = await verify(SECRET, token);
  logger.debug('verify captcha', { verifResponse });

  return verifResponse.success;
}

export function captchaMiddleware({ body: { token } }: Request, res: Response, next: NextFunction) {
  logger.debug('captcha', { token });
  verifyCaptcha(token).then((result) => {
    if (result) {
      next();
    } else {
      res.status(403).json({ error: 'Invalid captcha' });
    }
  });
}
