import { randomUUID } from 'node:crypto';

import config from '../src/config.js';
import { MainnetChallenge, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../src/database/index.js';
import { MainnetLifecycleWorker as Worker } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

const AMOUNT = '50000000000000';
const WALLET = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function resetMainnetRepos() {
  repos.MainnetChallenge.clear();
  repos.MainnetClaim.clear();
  repos.MainnetClaimEvent.clear();
}

function challenge(id: string, props: Partial<MainnetChallenge> = {}) {
  return new MainnetChallenge({
    id,
    canonicalWallet: WALLET,
    address: WALLET,
    genesis: process.env.VARA_MAINNET_GENESIS!,
    nonce: `nonce-${id}`,
    message: `message-${id}`,
    messageHex: `0x${id.padStart(64, '0').slice(0, 64)}`,
    expiresAt: new Date(),
    createdAt: new Date(),
    used: false,
    usedAt: null,
    ...props,
  });
}

function claim(id: string, status = MainnetClaimStatus.Rejected, props: Partial<MainnetClaim> = {}) {
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
    internalReasonCode: status === MainnetClaimStatus.Rejected ? 'test_reject' : null,
    transactionHash: null,
    blockHash: null,
    payoutStartedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...props,
  });
}

function event(id: string, props: Partial<MainnetClaimEvent> = {}) {
  return new MainnetClaimEvent({
    id,
    claimId: randomUUID(),
    fromStatus: null,
    toStatus: MainnetClaimStatus.Rejected,
    reasonCode: 'test',
    metadata: null,
    createdAt: new Date(),
    ...props,
  });
}

describe('Mainnet lifecycle worker', () => {
  let worker: Worker;

  beforeEach(() => {
    resetMainnetRepos();
    config.mainnet.expiredChallengeGraceMs = 60 * 60 * 1000;
    config.mainnet.rejectedClaimRetentionDays = 30;
    config.mainnet.auditEventRetentionDays = 180;
    worker = new Worker();
  });

  afterEach(() => {
    worker.stop();
    config.mainnet.expiredChallengeGraceMs = 60 * 60 * 1000;
    config.mainnet.rejectedClaimRetentionDays = 30;
    config.mainnet.auditEventRetentionDays = 180;
  });

  it('removes expired unused challenges, old rejected claims, and old audit events', async () => {
    const now = Date.now();
    await repos.MainnetChallenge.save([
      challenge('1', { expiresAt: new Date(now - 2 * 60 * 60 * 1000), used: false }),
      challenge('2', { expiresAt: new Date(now - 2 * 60 * 60 * 1000), used: true, usedAt: new Date(now - 90_000) }),
      challenge('3', { expiresAt: new Date(now + 60_000), used: false }),
    ]);
    await repos.MainnetClaim.save([
      claim('old-rejected', MainnetClaimStatus.Rejected, { updatedAt: new Date(now - 31 * 24 * 60 * 60 * 1000) }),
      claim('new-rejected', MainnetClaimStatus.Rejected, { updatedAt: new Date(now - 29 * 24 * 60 * 60 * 1000) }),
      claim('finalized', MainnetClaimStatus.Finalized, { updatedAt: new Date(now - 31 * 24 * 60 * 60 * 1000) }),
    ]);
    await repos.MainnetClaimEvent.save([
      event('old-event', { createdAt: new Date(now - 181 * 24 * 60 * 60 * 1000) }),
      event('new-event', { createdAt: new Date(now - 179 * 24 * 60 * 60 * 1000) }),
    ]);

    await worker.tick();

    expect(Object.keys(repos.MainnetChallenge._data()).sort()).toEqual(['2', '3']);
    expect(Object.keys(repos.MainnetClaim._data()).sort()).toEqual(['finalized', 'new-rejected']);
    expect(Object.keys(repos.MainnetClaimEvent._data())).toEqual(['new-event']);
  });

  it('can disable each retention cleanup with a negative setting', async () => {
    config.mainnet.expiredChallengeGraceMs = -1;
    config.mainnet.rejectedClaimRetentionDays = -1;
    config.mainnet.auditEventRetentionDays = -1;
    await repos.MainnetChallenge.save(challenge('1', { expiresAt: new Date(0), used: false }));
    await repos.MainnetClaim.save(claim('old-rejected', MainnetClaimStatus.Rejected, { updatedAt: new Date(0) }));
    await repos.MainnetClaimEvent.save(event('old-event', { createdAt: new Date(0) }));

    await worker.tick();

    expect(Object.keys(repos.MainnetChallenge._data())).toEqual(['1']);
    expect(Object.keys(repos.MainnetClaim._data())).toEqual(['old-rejected']);
    expect(Object.keys(repos.MainnetClaimEvent._data())).toEqual(['old-event']);
  });

  it('treats missing delete affected counts as zero', async () => {
    (repos.MainnetChallenge.delete as any).mockResolvedValueOnce({});
    (repos.MainnetClaim.delete as any).mockResolvedValueOnce({});
    (repos.MainnetClaimEvent.delete as any).mockResolvedValueOnce({});

    await expect(worker.tick()).resolves.toBeUndefined();
  });

  it('returns immediately when another lifecycle tick is running', async () => {
    (worker as any)._running = true;
    await repos.MainnetChallenge.save(challenge('1', { expiresAt: new Date(0), used: false }));

    await expect(worker.tick()).resolves.toBeUndefined();

    expect(Object.keys(repos.MainnetChallenge._data())).toEqual(['1']);
    (worker as any)._running = false;
  });

  it('isolates cron callback failures', async () => {
    const tick = vi.spyOn(worker, 'tick').mockRejectedValueOnce(new Error('cleanup failed'));

    worker.run();
    await (worker as any)._job.fireOnTick();

    expect(tick).toHaveBeenCalled();
  });
});
