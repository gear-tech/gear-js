import { createLogger } from 'gear-idea-common';
import { Request, Response } from 'express';
import { Hex } from 'viem';

import { rateLimitMiddleware } from './middleware/index.js';
import { RequestService } from '../services/index.js';
import { FaucetType } from '../database/index.js';
import { BaseRouter } from './base.js';
import config from '../config.js';

const logger = createLogger('wvara-router');

export class WvaraRouter extends BaseRouter {
  private _wvaraAddress: Hex;

  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/request', rateLimitMiddleware, this._handler.bind(this));

    if (!config.wvara.address) {
      throw new Error('WVARA_ADDRESS is not configured');
    }

    this._wvaraAddress = config.wvara.address;
  }

  private async _handler({ body: { address } }: Request, res: Response) {
    if (!address) {
      return res.status(400).send('User address is required');
    }

    const target = this._wvaraAddress;

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
