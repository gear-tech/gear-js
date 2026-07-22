import type { NextFunction, Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

const logger = createLogger('request');

export function requestLoggerMiddleware(req: Request, _res: Response, next: NextFunction) {
  const requestBody = req.body ?? {};

  if (Object.keys(requestBody).length > 0) {
    const { token, signature, ...body } = requestBody;
    logger.debug(`method: ${req.method}, url: ${req.originalUrl}`, {
      token: token?.slice(0, 10),
      ...(signature ? { signature: `${signature.slice(0, 10)}...` } : {}),
      ...body,
    });
  }
  return next();
}
