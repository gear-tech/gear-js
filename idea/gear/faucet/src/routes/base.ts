import express, { type NextFunction, type Request, type Response, Router } from 'express';

import { requestLoggerMiddleware } from './middleware/index.js';

export class BaseRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._router.use(corsMiddleware);
    this._router.use(express.json());
    this._router.use(requestLoggerMiddleware);
  }

  get router() {
    return this._router;
  }
}

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,Idempotency-Key',
  );
  res.header('Access-Control-Max-Age', '1728000');

  if (req.method === 'OPTIONS') return res.sendStatus(204);

  next();
}
