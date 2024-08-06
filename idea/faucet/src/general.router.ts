import { Request, Response, Router } from 'express';
import { randomUUID } from 'node:crypto';

import { GearService, TransferService } from './services';
import { RMQServiceAction, RMQServices, logger } from '@gear-js/common';

export class BalanceService {
  private router = Router({});

  constructor(private transferService: TransferService, private gearService: GearService) {}
  init() {
    this.router.post('/balance', this.handleBalance.bind(this));
    this.router.get('/genesis', this.handleGenesis.bind(this));
  }

  private handleBalance(req: Request, res: Response): void {
    const { payload, correlationId } = req.body;

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
      .transferBalance(payload, correlationId)
      .then((result) => res.json(result))
      .catch((error) => {
        logger.error(`Balance error`, { error });
        res.status(500);
      });
  }

  private handleGenesis(req: Request, res: Response): void {
    const payload = req.body;

    if (!payload) {
      return;
    }

    logger.info('Genesis request');

    const genesis = this.gearService.genesisHash;

    if (genesis !== null) {
      const correlationId = randomUUID();
      logger.info('Send genesis', { genesis, correlationId });
      res.json({ service: RMQServices.TEST_BALANCE, action: RMQServiceAction.ADD, genesis, correlationId });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
