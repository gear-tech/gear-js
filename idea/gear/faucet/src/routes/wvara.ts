import { createLogger } from 'gear-idea-common';
import { Request, Response } from 'express';

import { rateLimitMiddleware } from './middleware';
import { RequestService } from '../services';
import { FaucetType } from '../database';
import { BaseRouter } from './base';
import config from '../config';

const logger = createLogger('wvara-router');

export class WVARARouter extends BaseRouter {
  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/request', rateLimitMiddleware, this._handler.bind(this));
  }

  private async _handler({ body: { address } }: Request, res: Response) {
    if (!address) {
      return res.status(400).send('User address is required');
    }

    const target = config.wvara.address;

    try {
      await this._requestService.newRequest(address, target, FaucetType.WVara);
    } catch (error: any) {
      if (error.code) {
        logger.warn(error.message, { address, target });
        return res.status(error.code).json({ error: error.message });
      }

      logger.error(error.message, { stack: error.stack, address, target });

      return res.status(500).json({ error: error.message });
    }

    res.sendStatus(200);
  }
}
