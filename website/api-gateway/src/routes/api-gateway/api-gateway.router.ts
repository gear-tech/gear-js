import { Request, Response, Router } from 'express';

import { apiGatewayService } from '../../domain/api-gateway.service';
import { logger } from '../../helpers/logger';

export const apiGatewayRouter = Router({});

apiGatewayRouter.post('', async (req: Request, res: Response) => {
  try {
    const result = await apiGatewayService.rpc(req.body);
    res.json(result);
  } catch (err) {
    logger.error(`apiGatewayRouter:${err}`);
  }
});
