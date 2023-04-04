import { Request, Response, Router } from 'express';

import { logger } from '../../common/logger';
import { testBalanceMiddleware } from '../../middleware';
import { checkGenesisMiddleware } from '../../middleware';
import { validateJsonRpcRequestMiddleware } from '../../middleware/validate-json-rpc-request.middleware';
import { jsonRpcRequestHandler } from '../../json-rpc/json-rpc-request.handler';

export const apiGatewayRouter = Router();

apiGatewayRouter.post(
  '',
  validateJsonRpcRequestMiddleware,
  checkGenesisMiddleware,
  testBalanceMiddleware,
  async (req: Request, res: Response) => {
    try {
      const result = await jsonRpcRequestHandler(req.body);
      res.json(result);
    } catch (err) {
      logger.error(`ApiGatewayRouter: ${err}`);
      console.log(req.body);
      console.log(err);
    }
  },
);
