import type { Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

import { FaucetType } from '../database/index.js';
import type { RequestService } from '../services/index.js';
import { BaseRouter } from './base.js';
import { captchaMiddleware, rateLimitMiddleware } from './middleware/index.js';

const logger = createLogger('bridge-router');

export class VaraBridgeRouter extends BaseRouter {
  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/request', rateLimitMiddleware, captchaMiddleware, this._handler.bind(this));
  }

  private async _handler({ body: { address, contract, genesis } }: Request, res: Response) {
    if (!address) {
      return res.status(400).send('User address is required');
    }

    if (!contract || genesis) {
      return res.status(400).send('An ERC20 contract is required; Substrate genesis requests are no longer supported');
    }

    try {
      await this._requestService.newRequest(address, contract, FaucetType.BridgeErc20);
    } catch (error: any) {
      if (error.code) {
        logger.warn(error.message, { address, target: contract });
        return res.status(error.code).json({ error: error.message });
      }

      logger.error(error.message, { stack: error.stack, address, contract });

      return res.status(500).json({ error: error.message });
    }

    res.sendStatus(200);
  }
}
