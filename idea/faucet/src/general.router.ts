import { Request, Response, Router } from 'express';

import { GearService, TransferService } from './services';
import { logger } from '@gear-js/common';

export class BalanceService {
  private router = Router({});

  constructor(private transferService: TransferService, private gearService: GearService) {}
  init() {
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
      .then((result) => res.json(result))
      .catch((error) => {
        logger.error(`Balance error`, { error });
        res.status(500);
      });
  }

  getRouter(): Router {
    return this.router;
  }
}
