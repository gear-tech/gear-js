import { NextFunction, Request, Response } from 'express';
import { logger } from 'gear-idea-common';

export function requestLoggerMiddleware(req: Request, _: Response, next: NextFunction) {
  if (req.body) {
    logger.info(`${req.path}`, { token: req.body.token?.slice(0, 10), ...req.body });
  }
  return next();
}
