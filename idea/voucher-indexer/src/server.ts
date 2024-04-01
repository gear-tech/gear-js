import { logger } from '@gear-js/common';
import express, { Express } from 'express';

import { VoucherService } from './service';

export class Server {
  private _app: Express;

  constructor(private _service: VoucherService) {
    this._app = express();
    this._app.use(express.json());
  }

  public start() {
    this._app
      .get('/api/voucher/:id', async (req, res) => {
        try {
          const voucher = await this._service.getVoucher(req.params.id);
          res.json(voucher);
        } catch (error) {
          logger.error('Failed to get voucher', { id: req.params.id, error: error.message, stack: error.stack });
          res.status(500).json({ error: 'Internal server error' });
        }
      })
      .post('/api/vouchers', async (req, res) => {
        try {
          const vouchers = await this._service.getVouchers(req.body);
          res.json(vouchers);
        } catch (error) {
          console.error('Failed to get vouchers', { req: req.body, error: error.message, stack: error.stack });
          res.status(500).json({ error: 'Internal server error' });
        }
      });

    this._app.listen(3000, () => {
      logger.info(`Server started on port 3000`);
    });
  }
}
