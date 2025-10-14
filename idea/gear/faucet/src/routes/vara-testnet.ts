import { createLogger } from 'gear-idea-common';
import { Request, Response } from 'express';

import { captchaMiddleware, rateLimitMiddleware } from './middleware';
import { RequestService } from '../services';
import { FaucetType } from '../database';
import { BaseRouter } from './base';

const logger = createLogger('vara-router');

export class VaraTestnetRouter extends BaseRouter {
  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/balance', rateLimitMiddleware, captchaMiddleware, this._oldRequest.bind(this));
    this.router.post('/vara-testnet/request', rateLimitMiddleware, captchaMiddleware, this._newRequest.bind(this));
  }

  private _newRequest({ body: { address, genesis } }: Request, res: Response) {
    return this._handler(address, genesis, res);
  }

  private _oldRequest({ body: { payload } }: Request, res: Response) {
    return this._handler(payload?.address, payload?.genesis, res);
  }

  private async _handler(address: string, genesis: string, res: Response) {
    if (!address || !genesis) {
      res.status(400).json({ error: 'Address and genesis are required' });
      return;
    }

    try {
      await this._requestService.newRequest(address, genesis, FaucetType.VaraTestnet);
    } catch (error) {
      if (error.code) {
        logger.error(error.message, { address, target: genesis });
        return res.status(error.code).json({ error: error.message });
      }

      logger.error(error.message, { stack: error.stack, address, genesis });

      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(200);
  }
}
