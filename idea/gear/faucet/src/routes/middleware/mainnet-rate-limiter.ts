import { createHash } from 'node:crypto';
import type { Request, Response } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

import config from '../../config.js';

function clientKey(req: Request) {
  const cloudflareIp = req.header('cf-connecting-ip');
  const ip = cloudflareIp || ipKeyGenerator(req.ip!);
  return createHash('sha256').update(ip.trim().toLowerCase()).digest('hex');
}

function handler(_: Request, res: Response) {
  res.status(429).json({ error: 'rate_limited' });
}

export const mainnetChallengeRateLimitMiddleware = rateLimit({
  windowMs: config.mainnet.apiRateLimitWindowMs,
  max: config.mainnet.challengeRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  handler,
});

export const mainnetClaimRateLimitMiddleware = rateLimit({
  windowMs: config.mainnet.apiRateLimitWindowMs,
  max: config.mainnet.claimRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  handler,
});
