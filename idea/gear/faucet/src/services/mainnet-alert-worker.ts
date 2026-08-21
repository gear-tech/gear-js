import { CronJob } from 'cron';
import { createLogger } from 'gear-idea-common';

import config from '../config.js';
import { MainnetMetricsService, type MainnetMetricsSnapshot } from './mainnet-metrics.js';

const logger = createLogger('mainnet-alert-worker');

const AUTOMATION_REASONS = ['subnet_limit', 'full_ip_limit', 'device_already_claimed'];

export interface MainnetAlert {
  name: string;
  severity: 'warning' | 'critical';
  value: number | string;
  threshold: number | string;
}

export class MainnetAlertWorker {
  private _job: CronJob<any, this>;
  private _running = false;

  constructor(private _metrics = new MainnetMetricsService()) {}

  public run() {
    this._job = new CronJob(
      config.mainnet.alertCronTime,
      async () => {
        try {
          await this.tick();
        } catch (error: any) {
          logger.error('Alert tick failed', { error: error.message, stack: error.stack });
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
      const snapshot = await this._metrics.snapshot();
      const alerts = this.evaluate(snapshot);
      if (alerts.length === 0) {
        logger.info('Mainnet alert check passed');
        return;
      }

      logger.warn('Mainnet faucet alerts triggered', { alerts });
      await this._sendWebhook(alerts, snapshot);
    } finally {
      this._running = false;
    }
  }

  public evaluate(snapshot: MainnetMetricsSnapshot) {
    const alerts: MainnetAlert[] = [];
    const { claims, treasury, turnstile, lifecycle } = snapshot;

    if (claims.reconciliationBacklog > config.mainnet.alertReconciliationBacklogThreshold) {
      alerts.push({
        name: 'reconciliation_backlog',
        severity: 'critical',
        value: claims.reconciliationBacklog,
        threshold: config.mainnet.alertReconciliationBacklogThreshold,
      });
    }

    if (claims.payoutQueueSize >= config.mainnet.alertPayoutQueueThreshold) {
      alerts.push({
        name: 'payout_queue_size',
        severity: 'warning',
        value: claims.payoutQueueSize,
        threshold: config.mainnet.alertPayoutQueueThreshold,
      });
    }

    if (treasury.payoutsRemaining1h === 0) {
      alerts.push({ name: 'treasury_hourly_budget_exhausted', severity: 'warning', value: 0, threshold: '>0' });
    }
    if (treasury.payoutsRemaining24h === 0 || treasury.payoutSlotsRemainingByAmount === 0) {
      alerts.push({ name: 'treasury_daily_budget_exhausted', severity: 'critical', value: 0, threshold: '>0' });
    }

    const automationRejects = AUTOMATION_REASONS.reduce(
      (sum, reason) => sum + (claims.rejectedByReason[reason] ?? 0),
      0,
    );
    if (automationRejects >= config.mainnet.alertAutomationRejectThreshold) {
      alerts.push({
        name: 'automation_reject_spike',
        severity: 'warning',
        value: automationRejects,
        threshold: config.mainnet.alertAutomationRejectThreshold,
      });
    }

    const turnstileFailures = turnstile.verifications.failed ?? 0;
    const turnstileTotal = Object.values(turnstile.verifications).reduce((sum, count) => sum + count, 0);
    const failureRatio = turnstileTotal === 0 ? 0 : turnstileFailures / turnstileTotal;
    if (
      turnstileTotal >= config.mainnet.alertTurnstileMinSamples &&
      failureRatio >= config.mainnet.alertTurnstileFailureRatio
    ) {
      alerts.push({
        name: 'turnstile_failure_ratio',
        severity: 'warning',
        value: failureRatio.toFixed(4),
        threshold: config.mainnet.alertTurnstileFailureRatio,
      });
    }

    if (lifecycle.expiredUnusedChallenges >= config.mainnet.alertExpiredChallengeThreshold) {
      alerts.push({
        name: 'expired_challenge_backlog',
        severity: 'warning',
        value: lifecycle.expiredUnusedChallenges,
        threshold: config.mainnet.alertExpiredChallengeThreshold,
      });
    }

    return alerts;
  }

  private async _sendWebhook(alerts: MainnetAlert[], snapshot: MainnetMetricsSnapshot) {
    if (!config.mainnet.alertWebhookUrl) return;

    let response: Response;
    try {
      response = await fetch(config.mainnet.alertWebhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          service: 'vara-mainnet-faucet',
          generatedAt: snapshot.generatedAt,
          alerts,
        }),
      });
    } catch (error: any) {
      logger.error('Mainnet alert webhook failed', { error: error.message });
      return;
    }

    if (!response.ok) {
      logger.error('Mainnet alert webhook returned an error', { status: response.status });
    }
  }
}
