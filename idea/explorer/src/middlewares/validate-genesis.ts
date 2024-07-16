import { Response, Request, NextFunction } from 'express';

// TODO: format jsonrpc response
export function validateGenesisMiddleware(genesises: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body?.params?.genesis) {
      return res.json({ error: 'genesis is required' });
    }

    if (!genesises.includes(req.body.params.genesis)) {
      return res.json({ error: 'genesis is not supported' });
    }

    next();
  };
}
