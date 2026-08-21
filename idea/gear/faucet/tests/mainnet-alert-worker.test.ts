import config from '../src/config.js';
import { MainnetAlertWorker, type MainnetMetricsSnapshot } from '../src/services/index.js';

function snapshot(overrides: Partial<MainnetMetricsSnapshot> = {}): MainnetMetricsSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    claims: {
      byStatus: {},
      rejectedByReason: {},
      payoutQueueSize: 0,
      reconciliationBacklog: 0,
    },
    turnstile: {
      verifications: {},
    },
    payouts: {
      results: {},
    },
    treasury: {
      payoutsRemaining1h: 10,
      payoutsRemaining24h: 100,
      amountRemaining24h: '5000000000000000',
      payoutSlotsRemainingByAmount: 100,
    },
    lifecycle: {
      cleanup: {},
      expiredUnusedChallenges: 0,
      auditEventCount: 0,
    },
    ...overrides,
  };
}

describe('Mainnet alert worker', () => {
  beforeEach(() => {
    config.mainnet.alertWebhookUrl = undefined;
    config.mainnet.alertPayoutQueueThreshold = 10;
    config.mainnet.alertReconciliationBacklogThreshold = 0;
    config.mainnet.alertAutomationRejectThreshold = 20;
    config.mainnet.alertTurnstileFailureRatio = 0.5;
    config.mainnet.alertTurnstileMinSamples = 20;
    config.mainnet.alertExpiredChallengeThreshold = 100;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns no alerts for a healthy snapshot', () => {
    const worker = new MainnetAlertWorker();

    expect(worker.evaluate(snapshot())).toEqual([]);
  });

  it('detects payout queue, reconciliation, treasury, automation, turnstile, and lifecycle alerts', () => {
    const worker = new MainnetAlertWorker();
    const alerts = worker.evaluate(
      snapshot({
        claims: {
          byStatus: {},
          rejectedByReason: {
            subnet_limit: 10,
            full_ip_limit: 5,
            device_already_claimed: 5,
          },
          payoutQueueSize: 10,
          reconciliationBacklog: 1,
        },
        turnstile: {
          verifications: {
            success: 10,
            failed: 10,
          },
        },
        treasury: {
          payoutsRemaining1h: 0,
          payoutsRemaining24h: 0,
          amountRemaining24h: '0',
          payoutSlotsRemainingByAmount: 0,
        },
        lifecycle: {
          cleanup: {},
          expiredUnusedChallenges: 100,
          auditEventCount: 0,
        },
      }),
    );

    expect(alerts.map(({ name }) => name)).toEqual([
      'reconciliation_backlog',
      'payout_queue_size',
      'treasury_hourly_budget_exhausted',
      'treasury_daily_budget_exhausted',
      'automation_reject_spike',
      'turnstile_failure_ratio',
      'expired_challenge_backlog',
    ]);
  });

  it('does not alert on Turnstile failures below the sample threshold', () => {
    config.mainnet.alertTurnstileMinSamples = 3;
    const worker = new MainnetAlertWorker();

    expect(
      worker.evaluate(
        snapshot({
          turnstile: { verifications: { failed: 2 } },
        }),
      ),
    ).toEqual([]);
  });

  it('alerts on daily treasury exhaustion when amount slots are exhausted', () => {
    const worker = new MainnetAlertWorker();

    expect(
      worker.evaluate(
        snapshot({
          treasury: {
            payoutsRemaining1h: 1,
            payoutsRemaining24h: 1,
            amountRemaining24h: '0',
            payoutSlotsRemainingByAmount: 0,
          },
        }),
      ),
    ).toEqual([expect.objectContaining({ name: 'treasury_daily_budget_exhausted' })]);
  });

  it('returns immediately when another alert tick is running', async () => {
    const metrics = { snapshot: vi.fn() };
    const worker = new MainnetAlertWorker(metrics as any);
    (worker as any)._running = true;

    await expect(worker.tick()).resolves.toBeUndefined();

    expect(metrics.snapshot).not.toHaveBeenCalled();
  });

  it('runs a healthy tick without webhook traffic', async () => {
    const metrics = { snapshot: vi.fn().mockResolvedValue(snapshot()) };
    const worker = new MainnetAlertWorker(metrics as any);

    await worker.tick();

    expect(metrics.snapshot).toHaveBeenCalled();
  });

  it('does not send triggered alerts when webhook is not configured', async () => {
    const metrics = {
      snapshot: vi
        .fn()
        .mockResolvedValue(
          snapshot({ claims: { byStatus: {}, rejectedByReason: {}, payoutQueueSize: 11, reconciliationBacklog: 0 } }),
        ),
    };
    vi.stubGlobal('fetch', vi.fn());
    const worker = new MainnetAlertWorker(metrics as any);

    await worker.tick();

    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends triggered alerts to the configured webhook', async () => {
    config.mainnet.alertWebhookUrl = 'https://alerts.example/webhook';
    const metrics = {
      snapshot: vi
        .fn()
        .mockResolvedValue(
          snapshot({ claims: { byStatus: {}, rejectedByReason: {}, payoutQueueSize: 11, reconciliationBacklog: 0 } }),
        ),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
    const worker = new MainnetAlertWorker(metrics as any);

    await worker.tick();

    expect(fetch).toHaveBeenCalledWith(
      'https://alerts.example/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: expect.stringContaining('payout_queue_size'),
      }),
    );
  });

  it('does not fail the tick when webhook delivery throws or returns an error', async () => {
    config.mainnet.alertWebhookUrl = 'https://alerts.example/webhook';
    const metrics = {
      snapshot: vi
        .fn()
        .mockResolvedValue(
          snapshot({ claims: { byStatus: {}, rejectedByReason: {}, payoutQueueSize: 11, reconciliationBacklog: 0 } }),
        ),
    };
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('network'))
        .mockResolvedValueOnce(new Response('{}', { status: 500 })),
    );
    const worker = new MainnetAlertWorker(metrics as any);

    await expect(worker.tick()).resolves.toBeUndefined();
    await expect(worker.tick()).resolves.toBeUndefined();
  });

  it('isolates cron callback failures', async () => {
    const worker = new MainnetAlertWorker({ snapshot: vi.fn() } as any);
    const tick = vi.spyOn(worker, 'tick').mockRejectedValueOnce(new Error('alert failed'));

    worker.run();
    await (worker as any)._job.fireOnTick();

    expect(tick).toHaveBeenCalled();
    worker.stop();
  });
});
