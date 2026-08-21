import { randomUUID } from 'node:crypto';

import config from '../src/config.js';
import { MainnetChallenge, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../src/database/index.js';
import {
  MainnetMetricsService,
  recordMainnetLifecycleCleanup,
  recordMainnetPayout,
  recordMainnetTurnstileVerification,
  resetMainnetMetricsForTests,
} from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

const AMOUNT = '50000000000000';
const WALLET = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function resetMainnetRepos() {
  repos.MainnetChallenge.clear();
  repos.MainnetClaim.clear();
  repos.MainnetClaimEvent.clear();
  resetMainnetMetricsForTests();
}

function claim(id: string, status: MainnetClaimStatus, props: Partial<MainnetClaim> = {}) {
  return new MainnetClaim({
    id,
    challengeId: randomUUID(),
    idempotencyKey: randomUUID(),
    canonicalWallet: `${WALLET}${id}`,
    address: WALLET,
    genesis: process.env.VARA_MAINNET_GENESIS!,
    amount: AMOUNT,
    deviceHash: `device-${id}`,
    fullIpHash: `ip-${id}`,
    subnetHash: `subnet-${id}`,
    country: null,
    asn: null,
    isVpn: false,
    isProxy: false,
    isTor: false,
    isDatacenter: false,
    status,
    publicReasonCode: status === MainnetClaimStatus.Rejected ? 'not_eligible' : null,
    internalReasonCode: status === MainnetClaimStatus.Rejected ? 'subnet_limit' : null,
    transactionHash: null,
    blockHash: null,
    payoutStartedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...props,
  });
}

describe('Mainnet metrics service', () => {
  beforeEach(() => {
    resetMainnetRepos();
    config.mainnet.transferValue = 50;
    config.mainnet.maxAmount24h = 5000;
    config.mainnet.maxPayouts1h = 10;
    config.mainnet.maxPayouts24h = 100;
  });

  it('builds an operator metrics snapshot from database state and process counters', async () => {
    const now = Date.now();
    await repos.MainnetClaim.save([
      claim('queued', MainnetClaimStatus.Queued),
      claim('rejected-a', MainnetClaimStatus.Rejected),
      claim('rejected-b', MainnetClaimStatus.Rejected, { internalReasonCode: null }),
      claim('recon', MainnetClaimStatus.ReconciliationRequired),
      claim('finalized-hour', MainnetClaimStatus.Finalized, { payoutStartedAt: new Date(now - 10 * 60 * 1000) }),
      claim('submitted-day', MainnetClaimStatus.Submitted, { payoutStartedAt: new Date(now - 2 * 60 * 60 * 1000) }),
    ]);
    await repos.MainnetChallenge.save(
      new MainnetChallenge({
        id: 'challenge',
        canonicalWallet: WALLET,
        address: WALLET,
        genesis: process.env.VARA_MAINNET_GENESIS!,
        nonce: 'nonce',
        message: 'message',
        messageHex: '0x',
        expiresAt: new Date(0),
        createdAt: new Date(0),
        used: false,
        usedAt: null,
      }),
    );
    await repos.MainnetClaimEvent.save(
      new MainnetClaimEvent({
        id: 'event',
        claimId: randomUUID(),
        fromStatus: null,
        toStatus: MainnetClaimStatus.Queued,
        reasonCode: null,
        metadata: null,
        createdAt: new Date(),
      }),
    );
    recordMainnetTurnstileVerification('success');
    recordMainnetTurnstileVerification('success');
    recordMainnetTurnstileVerification('failed');
    recordMainnetPayout('finalized');
    recordMainnetLifecycleCleanup('expired_challenges', 2);

    const snapshot = await new MainnetMetricsService().snapshot();

    expect(snapshot.generatedAt).toEqual(expect.any(String));
    expect(snapshot.claims.byStatus).toMatchObject({
      queued: 1,
      rejected: 2,
      reconciliation_required: 1,
      finalized: 1,
      submitted: 1,
    });
    expect(snapshot.claims.rejectedByReason).toEqual({ subnet_limit: 1, unknown: 1 });
    expect(snapshot.claims.payoutQueueSize).toBe(1);
    expect(snapshot.claims.reconciliationBacklog).toBe(1);
    expect(snapshot.turnstile.verifications).toEqual({ success: 2, failed: 1 });
    expect(snapshot.payouts.results).toEqual({ finalized: 1 });
    expect(snapshot.treasury).toMatchObject({
      payoutsRemaining1h: 9,
      payoutsRemaining24h: 98,
      amountRemaining24h: '4900000000000000',
      payoutSlotsRemainingByAmount: 98,
    });
    expect(snapshot.lifecycle).toMatchObject({
      cleanup: { expired_challenges: 2 },
      expiredUnusedChallenges: 1,
      auditEventCount: 1,
    });
  });

  it('does not divide by zero when transfer value is zero', async () => {
    config.mainnet.transferValue = 0;

    const snapshot = await new MainnetMetricsService().snapshot();

    expect(snapshot.treasury.payoutSlotsRemainingByAmount).toBe(0);
  });
});
