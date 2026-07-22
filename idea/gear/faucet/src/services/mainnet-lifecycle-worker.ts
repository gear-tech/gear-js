import { CronJob } from 'cron';
import { createLogger } from 'gear-idea-common';
import { LessThan } from 'typeorm';

import config from '../config.js';
import {
  AppDataSource,
  MainnetChallenge,
  MainnetClaim,
  MainnetClaimEvent,
  MainnetClaimStatus,
} from '../database/index.js';
import { recordMainnetLifecycleCleanup } from './mainnet-metrics.js';

const logger = createLogger('mainnet-lifecycle-worker');

export class MainnetLifecycleWorker {
  private _job: CronJob<any, this>;
  private _running = false;

  public run() {
    this._job = new CronJob(
      config.mainnet.lifecycleCronTime,
      async () => {
        try {
          await this.tick();
        } catch (error: any) {
          logger.error('Lifecycle tick failed', { error: error.message, stack: error.stack });
        }
      },
      null,
      true,
      null,
      this,
      true,
      null,
      null,
      true,
    );
  }

  public stop() {
    this._job?.stop();
  }

  public async tick() {
    if (this._running) return;
    this._running = true;

    try {
      const now = Date.now();
      const [expiredChallenges, rejectedClaims, auditEvents] = await Promise.all([
        this._deleteExpiredUnusedChallenges(now),
        this._deleteOldRejectedClaims(now),
        this._deleteOldAuditEvents(now),
      ]);

      recordMainnetLifecycleCleanup('expired_challenges', expiredChallenges);
      recordMainnetLifecycleCleanup('rejected_claims', rejectedClaims);
      recordMainnetLifecycleCleanup('audit_events', auditEvents);
      logger.info('Lifecycle cleanup completed', { expiredChallenges, rejectedClaims, auditEvents });
    } finally {
      this._running = false;
    }
  }

  private async _deleteExpiredUnusedChallenges(now: number) {
    if (config.mainnet.expiredChallengeGraceMs < 0) return 0;

    const cutoff = new Date(now - config.mainnet.expiredChallengeGraceMs);
    const result = await AppDataSource.getRepository(MainnetChallenge).delete({
      used: false,
      expiresAt: LessThan(cutoff),
    });
    return result.affected ?? 0;
  }

  private async _deleteOldRejectedClaims(now: number) {
    if (config.mainnet.rejectedClaimRetentionDays < 0) return 0;

    const cutoff = daysAgo(now, config.mainnet.rejectedClaimRetentionDays);
    const result = await AppDataSource.getRepository(MainnetClaim).delete({
      status: MainnetClaimStatus.Rejected,
      updatedAt: LessThan(cutoff),
    });
    return result.affected ?? 0;
  }

  private async _deleteOldAuditEvents(now: number) {
    if (config.mainnet.auditEventRetentionDays < 0) return 0;

    const cutoff = daysAgo(now, config.mainnet.auditEventRetentionDays);
    const result = await AppDataSource.getRepository(MainnetClaimEvent).delete({
      createdAt: LessThan(cutoff),
    });
    return result.affected ?? 0;
  }
}

function daysAgo(now: number, days: number) {
  return new Date(now - days * 24 * 60 * 60 * 1000);
}
