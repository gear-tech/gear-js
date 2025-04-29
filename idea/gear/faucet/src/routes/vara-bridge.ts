import express, { Request, Response, Router } from 'express';
import { logger } from 'gear-idea-common';

import { captchaMiddleware } from './middleware';
import { RequestService } from '../services';

export class VaraBridgeRouter {
  private _router: Router;

  constructor(private _requestService: RequestService) {
    this._router = Router();
    this.router.use(express.json());
    this.router.use(captchaMiddleware);
    this.router.post('/request', this._handler.bind(this));
  }

  get router() {
    return this._router;
  }

  private async _handler({ body: { address, contract } }: Request, res: Response) {
    if (!address || !contract) {
      res.status(400).send('User address and contract address are required');
      return;
    }

    logger.info('New request', { addr: address, target: contract });

    try {
      await this._requestService.newRequest(address, contract);
    } catch (error) {
      if (error.code) {
        logger.error(error.message, { address, target: contract });
        return res.status(error.code).send(error.message);
      }

      logger.error(error.message, { stack: error.stack, address, contract });

      // TODO: adjust status code
      return res.status(500).json(error.message);
    }

    res.sendStatus(200);
  }
}
