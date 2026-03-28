import { createLogger } from 'gear-idea-common';
import { Request, Response } from 'express';
import { decodeAddress } from '@gear-js/api';

import {
  agentRateLimitMiddleware,
  agentChallengeRateLimitMiddleware,
} from './middleware';
import { createSignatureAuthMiddleware } from './middleware';
import { handleVaraTestnetRequest } from './handlers';
import { ChallengeService, RequestService } from '../services';
import { BaseRouter } from './base';
import config from '../config';

const logger = createLogger('agent-router');

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

class DailyCounter {
  private _count = 0;
  private _windowStart = Date.now();

  check(): boolean {
    this._resetIfExpired();
    return this._count < config.agent.dailyCap;
  }

  increment(): void {
    this._resetIfExpired();
    this._count++;
  }

  private _resetIfExpired() {
    if (Date.now() - this._windowStart > TWENTY_FOUR_HOURS) {
      this._count = 0;
      this._windowStart = Date.now();
    }
  }
}

export class AgentRouter extends BaseRouter {
  private _dailyCounter = new DailyCounter();

  constructor(
    private _requestService: RequestService,
    private _challengeService: ChallengeService,
  ) {
    super();

    const signatureAuth = createSignatureAuthMiddleware(this._challengeService);

    this.router.post('/agent/challenge', agentChallengeRateLimitMiddleware, this._challenge.bind(this));

    this.router.post(
      '/agent/vara-testnet/request',
      signatureAuth,
      agentRateLimitMiddleware,
      this._request.bind(this),
    );
  }

  private _challenge({ body: { address } }: Request, res: Response) {
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    try {
      decodeAddress(address);
    } catch {
      return res.status(400).json({ error: 'Invalid account address' });
    }

    const nonce = this._challengeService.createChallenge(address);
    res.json({ nonce, expiresIn: Math.floor(config.agent.challengeTtlMs / 1000) });
  }

  private async _request({ body: { address, genesis } }: Request, res: Response) {
    if (!this._dailyCounter.check()) {
      return res.status(429).json({ error: 'Agent faucet daily limit reached. Try again tomorrow.' });
    }
    await handleVaraTestnetRequest(address, genesis, this._requestService, logger, res);
    if (res.statusCode === 200) {
      this._dailyCounter.increment();
    }
  }
}
