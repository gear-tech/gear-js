import config from '../config.js';
import { AppDataSource, MainnetChallenge, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../database/index.js';
import { parseVaraAmount } from './mainnet-utils.js';

type CounterMap = Record<string, number>;

const counters = {
  turnstileVerifications: {} as CounterMap,
  payouts: {} as CounterMap,
  lifecycleCleanup: {} as CounterMap,
};

export class MainnetMetricsService {
  public async snapshot() {
    const claimRepo = AppDataSource.getRepository(MainnetClaim);
    const challengeRepo = AppDataSource.getRepository(MainnetChallenge);
    const eventRepo = AppDataSource.getRepository(MainnetClaimEvent);
    const claims = await claimRepo.find({ where: {} });
    const now = Date.now();
    const hourAgo = new Date(now - 60 * 60 * 1000);
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const activePayoutStatuses = [
      MainnetClaimStatus.Submitting,
      MainnetClaimStatus.Submitted,
      MainnetClaimStatus.InBlock,
      MainnetClaimStatus.Finalized,
    ];
    const activePayoutClaims = claims.filter(({ status }) => activePayoutStatuses.includes(status));
    const activePayoutClaims1h = activePayoutClaims.filter(({ payoutStartedAt }) => payoutStartedAt && payoutStartedAt >= hourAgo);
    const activePayoutClaims24h = activePayoutClaims.filter(({ payoutStartedAt }) => payoutStartedAt && payoutStartedAt >= dayAgo);
    const spent24h = activePayoutClaims24h.reduce((sum, { amount }) => sum + BigInt(amount), 0n);
    const payoutAmount = BigInt(parseVaraAmount(config.mainnet.transferValue));
    const dailyAmountLimit = BigInt(parseVaraAmount(config.mainnet.maxAmount24h));
    const remainingByAmount = payoutAmount === 0n ? 0 : Number((dailyAmountLimit - spent24h) / payoutAmount);
    const expiredUnusedChallenges = await challengeRepo.count({ where: { used: false } });
    const auditEventCount = await eventRepo.count({ where: {} });

    return {
      generatedAt: new Date().toISOString(),
      claims: {
        byStatus: countBy(claims, 'status'),
        rejectedByReason: countRejectedByReason(claims),
        payoutQueueSize: claims.filter(({ status }) => status === MainnetClaimStatus.Queued).length,
        reconciliationBacklog: claims.filter(({ status }) => status === MainnetClaimStatus.ReconciliationRequired).length,
      },
      turnstile: {
        verifications: { ...counters.turnstileVerifications },
      },
      payouts: {
        results: { ...counters.payouts },
      },
      treasury: {
        payoutsRemaining1h: Math.max(config.mainnet.maxPayouts1h - activePayoutClaims1h.length, 0),
        payoutsRemaining24h: Math.max(config.mainnet.maxPayouts24h - activePayoutClaims24h.length, 0),
        amountRemaining24h: (dailyAmountLimit - spent24h).toString(),
        payoutSlotsRemainingByAmount: Math.max(remainingByAmount, 0),
      },
      lifecycle: {
        cleanup: { ...counters.lifecycleCleanup },
        expiredUnusedChallenges,
        auditEventCount,
      },
    };
  }
}

export type MainnetMetricsSnapshot = Awaited<ReturnType<MainnetMetricsService['snapshot']>>;

export function recordMainnetTurnstileVerification(result: string) {
  increment(counters.turnstileVerifications, result);
}

export function recordMainnetPayout(result: string) {
  increment(counters.payouts, result);
}

export function recordMainnetLifecycleCleanup(type: string, count: number) {
  counters.lifecycleCleanup[type] = (counters.lifecycleCleanup[type] ?? 0) + count;
}

export function resetMainnetMetricsForTests() {
  counters.turnstileVerifications = {};
  counters.payouts = {};
  counters.lifecycleCleanup = {};
}

function increment(map: CounterMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function countBy<T extends Record<string, any>>(items: T[], key: keyof T) {
  return items.reduce<CounterMap>((result, item) => {
    increment(result, String(item[key]));
    return result;
  }, {});
}

function countRejectedByReason(claims: MainnetClaim[]) {
  return claims.reduce<CounterMap>((result, claim) => {
    if (claim.status !== MainnetClaimStatus.Rejected) return result;
    increment(result, claim.internalReasonCode ?? 'unknown');
    return result;
  }, {});
}
