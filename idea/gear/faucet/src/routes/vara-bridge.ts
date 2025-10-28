import { Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

import { captchaMiddleware, rateLimitMiddleware } from './middleware';
import { RequestService } from '../services';
import { BaseRouter } from './base';
import { FaucetType } from '../database';

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

    if ((contract && genesis) || (!contract && !genesis)) {
      return res.status(400).send('Either contract or genesis must be provided, but not both');
    }

    const target = contract || genesis;

    try {
      await this._requestService.newRequest(
        address,
        target,
        contract ? FaucetType.BridgeErc20 : FaucetType.BridgeVaraTestnet,
      );
    } catch (error) {
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
