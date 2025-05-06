import { NextFunction, Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

const logger = createLogger('request');

export function requestLoggerMiddleware(req: Request, _: Response, next: NextFunction) {
  if (Object.keys(req.body).length > 0) {
    const { token, ...body } = req.body;
    logger.debug(`method: ${req.method}, url: ${req.originalUrl}`, { token: token?.slice(0, 10), ...body });
  }
  return next();
}
