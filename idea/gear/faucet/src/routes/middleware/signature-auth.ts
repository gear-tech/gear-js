import { stringToU8a } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import type { NextFunction, Request, Response } from 'express';
import { createLogger } from 'gear-idea-common';

import type { ChallengeService } from '../../services/challenge';

const logger = createLogger('signature-auth');

export function createSignatureAuthMiddleware(challengeService: ChallengeService) {
  return function signatureAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const { address, signature, nonce } = req.body;

    if (!address || !signature || !nonce) {
      return res.status(400).json({ error: 'Address, signature, and nonce are required' });
    }

    if (!challengeService.consumeChallenge(address, nonce)) {
      logger.debug('Challenge verification failed', { address: `${address.slice(0, 10)}...` });
      return res.status(401).json({ error: 'Invalid or expired challenge' });
    }

    let result;
    try {
      result = signatureVerify(stringToU8a(nonce), signature, address);
    } catch {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    if (!result.isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    logger.debug('Signature verified', { address: `${address.slice(0, 10)}...` });
    next();
  };
}
