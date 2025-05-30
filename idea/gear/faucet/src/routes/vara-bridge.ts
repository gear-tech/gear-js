import { Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

import { captchaMiddleware, rateLimitMiddleware } from './middleware';
import { RequestService } from '../services';
import { BaseRouter } from './base';

const logger = createLogger('bridge-router');

export class VaraBridgeRouter extends BaseRouter {
  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/request', rateLimitMiddleware, captchaMiddleware, this._handler.bind(this));
  }

  private async _handler({ body: { address, contract } }: Request, res: Response) {
    if (!address || !contract) {
      res.status(400).send('User address and contract address are required');
      return;
    }

    try {
      await this._requestService.newRequest(address, contract);
    } catch (error) {
      if (error.code) {
        logger.warn(error.message, { address, target: contract });
        return res.status(error.code).json({ error: error.message });
      }

      logger.error(error.message, { stack: error.stack, address, contract });

      // TODO: adjust status code
      return res.status(500).json({ error: error.message });
    }

    res.sendStatus(200);
  }
}
