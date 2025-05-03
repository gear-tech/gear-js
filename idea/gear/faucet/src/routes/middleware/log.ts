import { NextFunction, Request, Response } from 'express';
import { logger } from 'gear-idea-common';

export function requestLoggerMiddleware(req: Request, _: Response, next: NextFunction) {
  logger.info(`${req.path}`, req.body);
  return next();
}
