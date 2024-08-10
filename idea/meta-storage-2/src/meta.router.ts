import express, { Request, Response, Router } from 'express';
import { logger } from '@gear-js/common';

import { MetaService } from './service';

export class MetaRouter {
  private router = Router({});

  constructor(private metaService: MetaService) {}

  public init(): void {
    this.router.use(express.json());
    this.router
      .get('/meta', this.getMetaDetails.bind(this))
      .post('/meta', this.addMetaDetails.bind(this))
      .get('/sails', this.getSails.bind(this))
      .post('/sails', this.addSails.bind(this));
  }

  private getMetaDetails(req: Request, res: Response): Response {
    const { hash } = req.query;

    if (!hash) {
      return res.status(400).json({ error: 'Missing hash' });
    }

    logger.info('Get meta details', { params: hash });

    this.metaService
      .get({ hash: hash.toString(), hex: undefined })
      .then((meta) => res.json(meta))
      .catch((err) => {
        logger.error('Error getting meta details', { error: err });
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  private addMetaDetails(req: Request, res: Response): Response {
    const { hash, hex } = req.body;

    if (!hash || !hex) {
      return res.status(400).json({ error: 'Missing hash or hex' });
    }

    this.metaService
      .addMetaDetails({ hash, hex })
      .then((meta) => res.json(meta))
      .catch((err) => {
        logger.error('Error adding meta details', { error: err });
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  private getSails(req: Request, res: Response): Response {
    const { codeId } = req.query;

    if (!codeId) {
      return res.status(400).json({ error: 'Missing codeId' });
    }

    this.metaService
      .getIdl({ codeId })
      .then((ids) => res.json(ids))
      .catch((err) => {
        logger.error('Error getting sails', { error: err });
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  private addSails(req: Request, res: Response): Response {
    const { codeId, data } = req.body;

    if (!codeId || !data) {
      return res.status(400).json({ error: 'Missing codeId or data' });
    }

    this.metaService
      .addIdl({ codeId, data })
      .then((ids) => res.json(ids))
      .catch((err) => {
        logger.error('Error adding sails', { error: err });
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  get Router() {
    return this.router;
  }
}
