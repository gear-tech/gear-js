import config from '../config.js';
import {
  AppDataSource,
  MainnetChallenge,
  MainnetClaim,
  MainnetClaimEvent,
  MainnetClaimStatus,
} from '../database/index.js';
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
    const now = Date.now();
    const hourAgo = new Date(now - 60 * 60 * 1000);
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const activePayoutStatuses = [
      MainnetClaimStatus.Submitting,
      MainnetClaimStatus.Submitted,
      MainnetClaimStatus.InBlock,
      MainnetClaimStatus.Finalized,
    ];
    const [
      statusCounts,
      rejectedReasonCounts,
      payoutQueueSize,
      reconciliationBacklog,
      activePayoutClaims1h,
      activePayoutClaims24h,
      amount24h,
      expiredUnusedChallenges,
      auditEventCount,
    ] = await Promise.all([
      claimRepo
        .createQueryBuilder('claim')
        .select('claim.status', 'key')
        .addSelect('COUNT(*)', 'count')
        .groupBy('claim.status')
        .getRawMany<{ key: string; count: string }>(),
      claimRepo
        .createQueryBuilder('claim')
        .select(`COALESCE(claim."internalReasonCode", 'unknown')`, 'key')
        .addSelect('COUNT(*)', 'count')
        .where('claim.status = :status', { status: MainnetClaimStatus.Rejected })
        .groupBy(`COALESCE(claim."internalReasonCode", 'unknown')`)
        .getRawMany<{ key: string; count: string }>(),
      claimRepo
        .createQueryBuilder('claim')
        .where('claim.status = :status', { status: MainnetClaimStatus.Queued })
        .getCount(),
      claimRepo
        .createQueryBuilder('claim')
        .where('claim.status = :status', { status: MainnetClaimStatus.ReconciliationRequired })
        .getCount(),
      claimRepo
        .createQueryBuilder('claim')
        .where('claim."payoutStartedAt" >= :hourAgo', { hourAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: activePayoutStatuses })
        .getCount(),
      claimRepo
        .createQueryBuilder('claim')
        .where('claim."payoutStartedAt" >= :dayAgo', { dayAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: activePayoutStatuses })
        .getCount(),
      claimRepo
        .createQueryBuilder('claim')
        .select('COALESCE(SUM(claim.amount), 0)', 'sum')
        .where('claim."payoutStartedAt" >= :dayAgo', { dayAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: activePayoutStatuses })
        .getRawOne<{ sum: string }>(),
      challengeRepo.count({ where: { used: false } }),
      eventRepo.count({ where: {} }),
    ]);
    const claimsByStatus = rowsToCounterMap(statusCounts);
    const rejectedByReason = rowsToCounterMap(rejectedReasonCounts);
    const spent24h = BigInt(amount24h!.sum);
    const payoutAmount = BigInt(parseVaraAmount(config.mainnet.transferValue));
    const dailyAmountLimit = BigInt(parseVaraAmount(config.mainnet.maxAmount24h));
    const remainingByAmount = payoutAmount === 0n ? 0 : Number((dailyAmountLimit - spent24h) / payoutAmount);

    return {
      generatedAt: new Date().toISOString(),
      claims: {
        byStatus: claimsByStatus,
        rejectedByReason,
        payoutQueueSize,
        reconciliationBacklog,
      },
      turnstile: {
        verifications: { ...counters.turnstileVerifications },
      },
      payouts: {
        results: { ...counters.payouts },
      },
      treasury: {
        payoutsRemaining1h: Math.max(config.mainnet.maxPayouts1h - activePayoutClaims1h, 0),
        payoutsRemaining24h: Math.max(config.mainnet.maxPayouts24h - activePayoutClaims24h, 0),
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

function rowsToCounterMap(rows: Array<{ key: string; count: string | number }>) {
  return rows.reduce<CounterMap>((result, { key, count }) => {
    result[key] = Number(count);
    return result;
  }, {});
}
