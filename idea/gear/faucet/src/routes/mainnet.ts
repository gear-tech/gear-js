import type { Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

import config from '../config.js';
import { MainnetClaimStatus } from '../database/index.js';
import { MainnetAdminService, MainnetFaucetError, MainnetMetricsService, type MainnetFaucetService } from '../services/index.js';
import { BaseRouter } from './base.js';
import { mainnetChallengeRateLimitMiddleware, mainnetClaimRateLimitMiddleware } from './middleware/index.js';

const logger = createLogger('mainnet-router');

export class MainnetRouter extends BaseRouter {
  constructor(
    private _mainnetFaucetService: MainnetFaucetService,
    private _mainnetMetricsService = new MainnetMetricsService(),
    private _mainnetAdminService = new MainnetAdminService(),
  ) {
    super();

    this.router.post('/challenge', mainnetChallengeRateLimitMiddleware, this._challenge.bind(this));
    this.router.post('/claims', mainnetClaimRateLimitMiddleware, this._createClaim.bind(this));
    this.router.get('/claims/:claimId', this._getClaim.bind(this));
    this.router.get('/admin/metrics', this._metrics.bind(this));
    this.router.get('/admin/reconciliation', this._listReconciliation.bind(this));
    this.router.post('/admin/reconciliation/:claimId', this._resolveReconciliation.bind(this));
  }

  private async _challenge(req: Request, res: Response) {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    try {
      assertTrustedOrigin(req);
      const challenge = await this._mainnetFaucetService.createChallenge(address);
      res.json(challenge);
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private async _createClaim(req: Request, res: Response) {
    const { address, challengeId, signature, turnstileToken, deviceToken } = req.body;
    const idempotencyKey = req.header('Idempotency-Key') ?? '';

    if (!address || !challengeId || !signature || !turnstileToken || !deviceToken) {
      return res.status(400).json({ error: 'Address, challengeId, signature, turnstileToken, and deviceToken are required' });
    }

    try {
      assertTrustedOrigin(req);
      const claim = await this._mainnetFaucetService.createClaim({
        address,
        challengeId,
        signature,
        turnstileToken,
        deviceToken,
        idempotencyKey,
        remoteIp: getClientIp(req),
        country: getHeader(req, 'cf-ipcountry'),
        asn: getHeader(req, 'cf-asn'),
        isVpn: getBooleanHeader(req, 'x-vara-risk-vpn'),
        isProxy: getBooleanHeader(req, 'x-vara-risk-proxy'),
        isTor: getBooleanHeader(req, 'x-vara-risk-tor'),
        isDatacenter: getBooleanHeader(req, 'x-vara-risk-datacenter'),
      });

      res.status(claim.status === MainnetClaimStatus.Rejected ? 202 : 200).json({
        claimId: claim.id,
        status: claim.status,
        ...(claim.publicReasonCode ? { reasonCode: claim.publicReasonCode } : {}),
      });
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private async _getClaim(req: Request, res: Response) {
    try {
      const claim = await this._mainnetFaucetService.getClaim(req.params.claimId as string);
      if (!claim) return res.status(404).json({ error: 'Claim not found' });

      res.json({
        status: claim.status,
        amount: claim.amount,
        transactionHash: claim.transactionHash,
        blockHash: claim.blockHash,
        ...(claim.publicReasonCode ? { reasonCode: claim.publicReasonCode } : {}),
      });
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private async _metrics(req: Request, res: Response) {
    try {
      assertAdmin(req);
      res.json(await this._mainnetMetricsService.snapshot());
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private async _listReconciliation(req: Request, res: Response) {
    try {
      assertAdmin(req);
      res.json({ claims: await this._mainnetAdminService.listReconciliation() });
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private async _resolveReconciliation(req: Request, res: Response) {
    try {
      assertAdmin(req);
      const claim = await this._mainnetAdminService.resolveReconciliation({
        claimId: req.params.claimId as string,
        action: req.body.action,
        transactionHash: req.body.transactionHash,
        blockHash: req.body.blockHash,
        reasonCode: req.body.reasonCode,
        note: req.body.note,
        operator: getHeader(req, 'x-admin-actor'),
      });
      res.json({ claim });
    } catch (error: any) {
      this._handleError(error, res);
    }
  }

  private _handleError(error: any, res: Response) {
    if (error instanceof MainnetFaucetError) {
      logger.warn('Mainnet faucet request rejected', { publicCode: error.publicCode, internalCode: error.internalCode });
      return res.status(error.statusCode).json({ error: error.publicCode });
    }

    logger.error('Mainnet faucet request failed', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'internal_error' });
  }
}

function getClientIp(req: Request) {
  const cfIp = getHeader(req, 'cf-connecting-ip');
  if (cfIp) return cfIp;

  return req.ip!;
}

function assertTrustedOrigin(req: Request) {
  if (config.mainnet.requireCloudflare && !getHeader(req, 'cf-connecting-ip')) {
    throw new MainnetFaucetError(403, 'untrusted_origin');
  }
}

function assertAdmin(req: Request) {
  if (!config.mainnet.adminApiKey) {
    throw new MainnetFaucetError(404, 'not_found', 'admin_metrics_disabled');
  }
  if (req.header('x-admin-key') !== config.mainnet.adminApiKey) {
    throw new MainnetFaucetError(403, 'forbidden', 'invalid_admin_key');
  }
}

function getHeader(req: Request, name: string) {
  const value = req.header(name);
  return value || undefined;
}

function getBooleanHeader(req: Request, name: string) {
  const value = getHeader(req, name)?.trim().toLowerCase();
  if (!value) return false;
  return value === '1' || value === 'true' || value === 'yes';
}
