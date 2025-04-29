import express, { Request, Response, Router } from 'express';
import { logger } from 'gear-idea-common';

import { captchaMiddleware } from './middleware';
import { RequestService } from '../services';

export class VaraTestnetRouter {
  private _router: Router;

  constructor(private _requestService: RequestService) {
    this._router = Router();
    this.router.use(express.json());
    this.router.use(captchaMiddleware);
    this.router.post('/balance', this._handler.bind(this));
  }

  get router() {
    return this._router;
  }

  private async _handler({ body: { payload } }: Request, res: Response) {
    if (!payload.address || !payload.genesis) {
      res.status(400).json({ error: 'Address and genesis are required' });
      return;
    }

    logger.info('New request', { addr: payload.address, target: 'vara_testnet' });

    try {
      await this._requestService.newRequest(payload.address, payload.genesis);
    } catch (error) {
      if (error.code) {
        logger.error(error.message, { address: payload.address, target: 'vara_testnet' });
        return res.status(error.code).json({ error: error.message });
      }

      logger.error(error.message, { stack: error.stack, payload });

      // TODO: adjust status code
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(200);
  }
}
