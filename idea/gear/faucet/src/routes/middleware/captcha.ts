import { Response, Request, NextFunction } from 'express';
import { logger } from 'gear-idea-common';

import config from '../../config';

const SECRET_KEY = config.server.captchaSecret;
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: SECRET_KEY,
        response: token,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    logger.error('Turnstile validation error:', error);
    return false;
  }
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
