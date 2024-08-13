import express, { Request, Response, Router } from 'express';

import { GearService, TransferService } from './services';
import { JSONRPC_ERRORS, logger } from '@gear-js/common';
import { captchaMiddleware } from './middleware/balance.middleware';

const errors = {
  [JSONRPC_ERRORS.InvalidAddress.name]: 403,
  [JSONRPC_ERRORS.TransferLimitReached.name]: 403,
  [JSONRPC_ERRORS.InternalError.name]: 500,
};

export class BalanceService {
  private router = Router({});

  constructor(private transferService: TransferService, private gearService: GearService) {}
  init() {
    this.router.use(express.json());
    this.router.use(captchaMiddleware);
    this.router.post('/balance', this.handleBalance.bind(this));
  }

  private handleBalance(req: Request, res: Response): void {
    const { payload } = req.body;

    if (!payload.address || !payload.genesis) {
      res.status(400).json({ error: 'Address and genesis are required' });
      return;
    }

    if (payload.genesis !== this.gearService.genesisHash) {
      res.status(400).json({ error: 'Invalid genesis' });
      return;
    }

    logger.info('New balance request', { addr: payload.address });

    this.transferService
      .transferBalance(payload)
      .then((response) => {
        if ('result' in response) {
          return res.json(response.result);
        }

        const error = errors[response.error];
        if (error) {
          return res.status(error).json({ error: response.error });
        }
      })
      .catch((error) => {
        logger.error(`Balance error`, { error });
        res.status(500);
      });
  }

  getRouter(): Router {
    return this.router;
  }
}
