import { createLogger } from 'gear-idea-common';
import { Request, Response } from 'express';

import { captchaMiddleware, rateLimitMiddleware } from './middleware';
import { handleVaraTestnetRequest } from './handlers';
import { RequestService } from '../services';
import { BaseRouter } from './base';

const logger = createLogger('vara-router');

export class VaraTestnetRouter extends BaseRouter {
  constructor(private _requestService: RequestService) {
    super();
    this.router.post('/balance', rateLimitMiddleware, captchaMiddleware, this._oldRequest.bind(this));
    this.router.post('/vara-testnet/request', rateLimitMiddleware, captchaMiddleware, this._newRequest.bind(this));
  }

  private _newRequest({ body: { address, genesis } }: Request, res: Response) {
    return handleVaraTestnetRequest(address, genesis, this._requestService, logger, res);
  }

  private _oldRequest({ body: { payload } }: Request, res: Response) {
    return handleVaraTestnetRequest(payload?.address, payload?.genesis, this._requestService, logger, res);
  }
}
