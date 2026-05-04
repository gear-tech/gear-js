import * as crypto from 'node:crypto';
import { decodeAddress } from '@gear-js/api';
import { createLogger } from 'gear-idea-common';

const logger = createLogger('challenge');

function canonicalize(address: string): string {
  try {
    return decodeAddress(address);
  } catch {
    return address;
  }
}

interface Challenge {
  nonce: string;
  createdAt: number;
}

export class ChallengeService {
  private _challenges: Map<string, Challenge> = new Map();
  private _cleanupInterval: ReturnType<typeof setInterval>;

  constructor(private _ttlMs: number) {
    this._cleanupInterval = setInterval(() => this._cleanup(), this._ttlMs);
  }

  createChallenge(address: string): string {
    const key = canonicalize(address);
    const nonce = `0x${crypto.randomBytes(32).toString('hex')}`;
    this._challenges.set(key, { nonce, createdAt: Date.now() });
    logger.debug('Challenge created', { address: `${address.slice(0, 10)}...` });
    return nonce;
  }

  consumeChallenge(address: string, nonce: string): boolean {
    const key = canonicalize(address);
    const challenge = this._challenges.get(key);

    if (!challenge) return false;
    if (challenge.nonce !== nonce) return false;
    if (Date.now() - challenge.createdAt > this._ttlMs) {
      this._challenges.delete(key);
      return false;
    }

    this._challenges.delete(key);
    return true;
  }

  stop() {
    clearInterval(this._cleanupInterval);
  }

  private _cleanup() {
    const now = Date.now();
    for (const [addr, challenge] of this._challenges) {
      if (now - challenge.createdAt > this._ttlMs) {
        this._challenges.delete(addr);
      }
    }
  }
}
