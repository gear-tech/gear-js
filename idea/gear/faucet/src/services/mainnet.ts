import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { decodeAddress } from '@gear-js/api';
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { createLogger } from 'gear-idea-common';
import { MoreThanOrEqual, Not, type EntityManager } from 'typeorm';

import config from '../config.js';
import { AppDataSource, MainnetChallenge, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../database/index.js';
import { recordMainnetTurnstileVerification } from './mainnet-metrics.js';
import { parseVaraAmount } from './mainnet-utils.js';

const logger = createLogger('mainnet-faucet');
const TURNSTILE_ACTION = 'mainnet_faucet_claim';

export class MainnetFaucetError extends Error {
  constructor(
    public statusCode: number,
    public publicCode: string,
    public internalCode = publicCode,
  ) {
    super(publicCode);
  }
}

export interface MainnetClaimRequest {
  address: string;
  challengeId: string;
  signature: string;
  turnstileToken: string;
  deviceToken: string;
  idempotencyKey: string;
  remoteIp: string;
  country?: string;
  asn?: string;
  isVpn?: boolean;
  isProxy?: boolean;
  isTor?: boolean;
  isDatacenter?: boolean;
}

export class MainnetFaucetService {
  private readonly _amount: string;

  constructor() {
    if (!config.mainnet.genesis) throw new MainnetFaucetError(500, 'server_misconfigured', 'missing_mainnet_genesis');
    if (!config.mainnet.hmacSecret) throw new MainnetFaucetError(500, 'server_misconfigured', 'missing_hmac_secret');
    if (config.mainnet.turnstileRequired && (!config.mainnet.turnstileSecret || !config.mainnet.turnstileHostname)) {
      throw new MainnetFaucetError(500, 'server_misconfigured', 'missing_turnstile_configuration');
    }
    this._amount = parseVaraAmount(config.mainnet.transferValue);
  }

  public async createChallenge(address: string) {
    if (typeof address !== 'string' || address.length > 128) throw new MainnetFaucetError(400, 'invalid_address');
    const canonicalWallet = canonicalizeWallet(address);
    const challengeId = randomUUID();
    const nonce = `0x${randomBytes(32).toString('hex')}`;
    const genesis = this._genesis();
    const expiresAt = new Date(Date.now() + config.mainnet.challengeTtlMs);
    const message = [
      'Vara Mainnet Faucet',
      `challengeId:${challengeId}`,
      `wallet:${canonicalWallet}`,
      `genesis:${genesis}`,
      `nonce:${nonce}`,
    ].join('\n');
    const messageHex = u8aToHex(stringToU8a(message));

    await AppDataSource.getRepository(MainnetChallenge).save(
      new MainnetChallenge({
        id: challengeId,
        canonicalWallet,
        address,
        genesis,
        nonce,
        message,
        messageHex,
        expiresAt,
        used: false,
      }),
    );

    return { challengeId, messageHex, expiresAt };
  }

  public async createClaim(request: MainnetClaimRequest) {
    if (config.mainnet.emergencyPause) {
      throw new MainnetFaucetError(503, 'temporarily_unavailable', 'emergency_pause');
    }
    if (!request.idempotencyKey) {
      throw new MainnetFaucetError(400, 'invalid_request', 'missing_idempotency_key');
    }
    if (!isUuid(request.idempotencyKey) || !isUuid(request.challengeId)) {
      throw new MainnetFaucetError(400, 'invalid_request', 'invalid_request_id');
    }
    if (typeof request.deviceToken !== 'string' || request.deviceToken.length < 8 || request.deviceToken.length > 512) {
      throw new MainnetFaucetError(400, 'invalid_request', 'invalid_device_token');
    }
    if (typeof request.signature !== 'string' || request.signature.length > 512) {
      throw new MainnetFaucetError(400, 'invalid_request', 'invalid_signature_format');
    }

    const canonicalWallet = canonicalizeWallet(request.address);
    const existing = await AppDataSource.getRepository(MainnetClaim).findOne({
      where: { idempotencyKey: request.idempotencyKey },
    });
    if (existing) {
      if (existing.challengeId !== request.challengeId || existing.canonicalWallet !== canonicalWallet) {
        throw new MainnetFaucetError(409, 'idempotency_conflict');
      }
      return existing;
    }

    const turnstileVerified = await this._verifyTurnstile(request.turnstileToken, request.remoteIp, request.challengeId);

    try {
      return await AppDataSource.transaction(async (manager) => {
        const challenge = await manager.getRepository(MainnetChallenge).findOne({
          where: { id: request.challengeId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!challenge) {
          throw new MainnetFaucetError(401, 'invalid_challenge');
        }
        if (challenge.used) {
          const concurrentClaim = await manager.getRepository(MainnetClaim).findOne({
            where: { idempotencyKey: request.idempotencyKey },
          });
          if (concurrentClaim) {
            if (concurrentClaim.challengeId === request.challengeId && concurrentClaim.canonicalWallet === canonicalWallet) {
              return concurrentClaim;
            }
            throw new MainnetFaucetError(409, 'idempotency_conflict');
          }
          throw new MainnetFaucetError(401, 'invalid_challenge');
        }
        if (challenge.expiresAt.getTime() < Date.now()) throw new MainnetFaucetError(401, 'invalid_challenge');
        if (challenge.canonicalWallet !== canonicalWallet || challenge.genesis !== this._genesis()) {
          throw new MainnetFaucetError(401, 'invalid_challenge', 'challenge_scope_mismatch');
        }

        assertSignature(challenge.message, request.signature, request.address);

        const claim = await this._buildClaim(manager, request, canonicalWallet, turnstileVerified);
        challenge.used = true;
        challenge.usedAt = new Date();
        await manager.getRepository(MainnetChallenge).save(challenge);
        await manager.getRepository(MainnetClaim).save(claim);
        await manager.getRepository(MainnetClaimEvent).save(
          new MainnetClaimEvent({
            id: randomUUID(),
            claimId: claim.id,
            fromStatus: null,
            toStatus: claim.status,
            reasonCode: claim.internalReasonCode,
            metadata: null,
            createdAt: new Date(),
          }),
        );
        return claim;
      });
    } catch (error: any) {
      if (!isUniqueViolation(error)) throw error;

      const racedClaim = await AppDataSource.getRepository(MainnetClaim).findOne({
        where: { idempotencyKey: request.idempotencyKey },
      });
      if (racedClaim && racedClaim.challengeId === request.challengeId && racedClaim.canonicalWallet === canonicalWallet) {
        return racedClaim;
      }

      const internalCode = uniqueViolationReason(error);
      throw new MainnetFaucetError(409, publicRejectReasonCode(internalCode), internalCode);
    }
  }

  public async getClaim(claimId: string) {
    return AppDataSource.getRepository(MainnetClaim).findOne({ where: { id: claimId } });
  }

  private async _buildClaim(manager: EntityManager, request: MainnetClaimRequest, canonicalWallet: string, turnstileVerified: boolean) {
    const ip = normalizeIp(request.remoteIp);
    const fullIpHash = hmac(ip);
    const subnetHash = hmac(normalizeSubnet(ip));
    const deviceHash = hmac(request.deviceToken);
    const country = normalizeCountry(request.country);
    const asn = normalizeAsn(request.asn);
    const isVpn = request.isVpn === true;
    const isProxy = request.isProxy === true;
    const isTor = request.isTor === true;
    const isDatacenter = request.isDatacenter === true;
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const claimRepo = manager.getRepository(MainnetClaim);

    const [walletClaims, deviceClaims, fullIpClaims24h, subnetClaims24h, globalClaims1h, globalClaims24h, amount24h] =
      await Promise.all([
        claimRepo.count({ where: { canonicalWallet, status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo.count({ where: { deviceHash, status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo.count({ where: { fullIpHash, createdAt: MoreThanOrEqual(dayAgo), status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo.count({ where: { subnetHash, createdAt: MoreThanOrEqual(dayAgo), status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo.count({ where: { createdAt: MoreThanOrEqual(hourAgo), status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo.count({ where: { createdAt: MoreThanOrEqual(dayAgo), status: Not(MainnetClaimStatus.Rejected) } }),
        claimRepo
          .createQueryBuilder('claim')
          .select('COALESCE(SUM(claim.amount), 0)', 'sum')
          .where('claim."createdAt" >= :dayAgo', { dayAgo })
          .andWhere('claim.status != :rejected', { rejected: MainnetClaimStatus.Rejected })
          .getRawOne<{ sum: string }>(),
      ]);

    const reason = firstRejectReason({
      walletClaims,
      deviceClaims,
      fullIpClaims24h,
      subnetClaims24h,
      globalClaims1h,
      globalClaims24h,
      amount24h: amount24h?.sum ?? '0',
      country,
      asn,
      isVpn,
      isProxy,
      isTor,
      isDatacenter,
      turnstileVerified,
    });

    return new MainnetClaim({
      id: request.challengeId,
      challengeId: request.challengeId,
      idempotencyKey: request.idempotencyKey,
      canonicalWallet,
      address: request.address,
      genesis: this._genesis(),
      amount: this._amount,
      deviceHash,
      fullIpHash,
      subnetHash,
      country,
      asn,
      isVpn,
      isProxy,
      isTor,
      isDatacenter,
      status: reason ? MainnetClaimStatus.Rejected : MainnetClaimStatus.Queued,
      publicReasonCode: reason ? publicRejectReasonCode(reason) : null,
      internalReasonCode: reason,
      transactionHash: null,
      blockHash: null,
      payoutStartedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  private async _verifyTurnstile(token: string, remoteIp: string, cdata: string) {
    if (!config.mainnet.turnstileRequired) {
      recordMainnetTurnstileVerification('disabled');
      return false;
    }
    if (!token) throw new MainnetFaucetError(400, 'invalid_request', 'missing_turnstile_token');
    if (!config.mainnet.turnstileSecret) throw new MainnetFaucetError(500, 'server_misconfigured', 'missing_turnstile_secret');

    const body = new URLSearchParams({
      secret: config.mainnet.turnstileSecret,
      response: token,
      remoteip: remoteIp,
    });

    let response: Response;
    try {
      response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body,
      });
    } catch (error: any) {
      recordMainnetTurnstileVerification('network_error');
      logger.error('Turnstile verification request failed', { error: error.message });
      throw new MainnetFaucetError(503, 'verification_unavailable', 'turnstile_request_failed');
    }
    if (!response.ok) {
      recordMainnetTurnstileVerification('http_error');
      throw new MainnetFaucetError(503, 'verification_unavailable', `turnstile_http_${response.status}`);
    }

    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      cdata?: string;
      challenge_ts?: string;
      'error-codes'?: string[];
    };

    if (!result.success) {
      recordMainnetTurnstileVerification('failed');
      logger.warn('Turnstile rejected claim', { errors: result['error-codes'] });
      throw new MainnetFaucetError(401, 'verification_failed', 'turnstile_failed');
    }
    if (config.mainnet.turnstileHostname && result.hostname !== config.mainnet.turnstileHostname) {
      recordMainnetTurnstileVerification('failed');
      throw new MainnetFaucetError(401, 'verification_failed', 'turnstile_hostname_mismatch');
    }
    if (result.action !== TURNSTILE_ACTION || result.cdata !== cdata) {
      recordMainnetTurnstileVerification('failed');
      throw new MainnetFaucetError(401, 'verification_failed', 'turnstile_scope_mismatch');
    }
    const challengeTimestamp = result.challenge_ts ? Date.parse(result.challenge_ts) : Number.NaN;
    const challengeAge = Date.now() - challengeTimestamp;
    if (!Number.isFinite(challengeTimestamp) || challengeAge < -60_000 || challengeAge > config.mainnet.challengeTtlMs) {
      recordMainnetTurnstileVerification('failed');
      throw new MainnetFaucetError(401, 'verification_failed', 'turnstile_expired');
    }

    recordMainnetTurnstileVerification('success');
    return true;
  }

  private _genesis() {
    return config.mainnet.genesis!;
  }
}

function isUniqueViolation(error: any) {
  return error?.code === '23505' || error?.driverError?.code === '23505';
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function uniqueViolationReason(error: any) {
  const constraint = error?.constraint ?? error?.driverError?.constraint ?? '';
  if (constraint.includes('wallet')) return 'wallet_already_claimed';
  if (constraint.includes('challenge')) return 'challenge_already_used';
  if (constraint.includes('idempotency')) return 'idempotency_conflict';
  return 'duplicate_claim';
}

function publicRejectReasonCode(internalCode: string) {
  switch (internalCode) {
    case 'wallet_already_claimed':
      return 'wallet_limit_reached';
    case 'device_already_claimed':
      return 'device_limit_reached';
    case 'full_ip_limit':
    case 'subnet_limit':
      return 'network_limit_reached';
    case 'global_hour_limit':
    case 'global_day_limit':
    case 'daily_amount_limit':
      return 'faucet_capacity_reached';
    case 'medium_risk_requires_captcha':
      return 'verification_required';
    case 'idempotency_conflict':
      return 'idempotency_conflict';
    default:
      return 'not_eligible';
  }
}

function canonicalizeWallet(address: string) {
  try {
    return decodeAddress(address);
  } catch {
    throw new MainnetFaucetError(400, 'invalid_address');
  }
}

function assertSignature(message: string, signature: string, address: string) {
  try {
    if (!signatureVerify(stringToU8a(message), signature, address).isValid) {
      throw new MainnetFaucetError(401, 'invalid_signature');
    }
  } catch (error) {
    if (error instanceof MainnetFaucetError) throw error;
    throw new MainnetFaucetError(401, 'invalid_signature');
  }
}

function hmac(value: string) {
  return createHmac('sha256', config.mainnet.hmacSecret!).update(value).digest('hex');
}

function normalizeIp(value: string) {
  const ip = value.trim().toLowerCase().split('%')[0];
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const octets = ip.split('.').map(Number);
    if (octets.some((octet) => octet > 255)) throw new MainnetFaucetError(400, 'invalid_request', 'invalid_remote_ip');
    return octets.join('.');
  }

  try {
    const normalized = new URL(`http://[${ip}]`).hostname.slice(1, -1);
    return expandIpv6(normalized);
  } catch {
    throw new MainnetFaucetError(400, 'invalid_request', 'invalid_remote_ip');
  }
}

function normalizeSubnet(ip: string) {
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.');
  }

  return ip.split(':').slice(0, 4).join(':');
}

function normalizeCountry(value?: string) {
  if (!value) return null;
  const country = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : null;
}

function normalizeAsn(value?: string) {
  if (!value) return null;
  const asn = value.trim().toUpperCase();
  if (/^AS\d{1,10}$/.test(asn)) return asn;
  if (/^\d{1,10}$/.test(asn)) return `AS${asn}`;
  return null;
}

function expandIpv6(ip: string) {
  const [left = '', right = ''] = ip.split('::');
  const leftGroups = left ? left.split(':') : [];
  const rightGroups = right ? right.split(':') : [];
  const missingGroups = 8 - leftGroups.length - rightGroups.length;
  const groups = [...leftGroups, ...Array.from({ length: missingGroups }, () => '0'), ...rightGroups];
  return groups.map((group) => group.padStart(4, '0')).join(':');
}

function firstRejectReason(input: {
  walletClaims: number;
  deviceClaims: number;
  fullIpClaims24h: number;
  subnetClaims24h: number;
  globalClaims1h: number;
  globalClaims24h: number;
  amount24h: string;
  country: string | null;
  asn: string | null;
  isVpn: boolean;
  isProxy: boolean;
  isTor?: boolean;
  isDatacenter?: boolean;
  turnstileVerified: boolean;
}) {
  if (input.walletClaims > 0) return 'wallet_already_claimed';
  if (input.deviceClaims > 0) return 'device_already_claimed';
  if (input.fullIpClaims24h >= config.mainnet.fullIpLimit24h) return 'full_ip_limit';
  if (input.subnetClaims24h >= config.mainnet.subnetLimit24h) return 'subnet_limit';
  if (input.globalClaims1h >= Math.min(config.mainnet.globalLimit1h, config.mainnet.maxPayouts1h)) return 'global_hour_limit';
  if (input.globalClaims24h >= Math.min(config.mainnet.globalLimit24h, config.mainnet.maxPayouts24h)) return 'global_day_limit';
  if (BigInt(input.amount24h) + BigInt(parseVaraAmount(config.mainnet.transferValue)) > BigInt(parseVaraAmount(config.mainnet.maxAmount24h))) {
    return 'daily_amount_limit';
  }
  if (input.isTor) return 'tor';
  if (input.isDatacenter) return 'datacenter';
  if (input.country && config.mainnet.highRiskCountries.includes(input.country)) return 'high_risk_country';
  if (input.asn && config.mainnet.highRiskAsns.includes(input.asn)) return 'high_risk_asn';
  if (isMediumRisk(input) && config.mainnet.rejectMediumRiskWithoutTurnstile && !input.turnstileVerified) {
    return 'medium_risk_requires_captcha';
  }
  return null;
}

function isMediumRisk(input: { country: string | null; asn: string | null; isVpn: boolean; isProxy: boolean }) {
  if (input.isVpn) return true;
  if (input.isProxy) return true;
  if (input.country && config.mainnet.mediumRiskCountries.includes(input.country)) return true;
  if (input.asn && config.mainnet.mediumRiskAsns.includes(input.asn)) return true;
  return false;
}
