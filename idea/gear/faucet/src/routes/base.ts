import express, { Router } from 'express';

import { requestLoggerMiddleware } from './middleware';

export class BaseRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._router.use(express.json());
    this._router.use(requestLoggerMiddleware);
  }

  get router() {
    return this._router;
  }
}
