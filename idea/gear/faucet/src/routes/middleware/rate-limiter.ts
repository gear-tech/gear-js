import { rateLimit } from 'express-rate-limit';
import xxhash from 'xxhashjs';
import config from '../../config';

export const rateLimitMiddleware = rateLimit({
  windowMs: config.server.rateLimitMs,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    xxhash
      .h32(0xaa)
      .update(
        `${req.body?.address || req.body?.payload?.address}${req.body?.genesis || req.body?.contract || req.body?.payload?.genesis}`,
      )
      .digest()
      .toString(),
  handler: (_, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
