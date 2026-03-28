import { rateLimit } from 'express-rate-limit';
import { decodeAddress } from '@gear-js/api';
import xxhash from 'xxhashjs';

import config from '../../config';

function normalizeAddress(address: string | undefined): string {
  if (!address) return '';
  try {
    return decodeAddress(address);
  } catch {
    return address;
  }
}

export const agentRateLimitMiddleware = rateLimit({
  windowMs: config.agent.rateLimitMs,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    xxhash
      .h32(0xbb)
      .update(`${normalizeAddress(req.body?.address)}${req.body?.genesis}`)
      .digest()
      .toString(),
  handler: (_, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});

export const agentChallengeRateLimitMiddleware = rateLimit({
  windowMs: config.agent.rateLimitMs,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    xxhash
      .h32(0xcc)
      .update(`challenge-${normalizeAddress(req.body?.address)}`)
      .digest()
      .toString(),
  handler: (_, res) => {
    res.status(429).json({ error: 'Too many challenge requests, please try again later.' });
  },
});
