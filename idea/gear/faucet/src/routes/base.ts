import express, { Router } from 'express';
import { captchaMiddleware, requestLoggerMiddleware } from './middleware';

export class BaseRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._router.use(express.json());
    this._router.use(requestLoggerMiddleware);
    this._router.use(captchaMiddleware);
  }

  get router() {
    return this._router;
  }
}
