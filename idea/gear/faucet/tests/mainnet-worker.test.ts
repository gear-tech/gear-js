import { mnemonicGenerate } from '@polkadot/util-crypto';

import config from '../src/config.js';
import { AppDataSource, MainnetClaim, MainnetClaimStatus } from '../src/database/index.js';
import { MainnetPayoutWorker } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';
import { gearMockState } from './__mocks__/gear-js.js';

const AMOUNT = '50000000000000';
const WALLET = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function resetMainnetRepos() {
  repos.MainnetChallenge.clear();
  repos.MainnetClaim.clear();
  repos.MainnetClaimEvent.clear();
}

function claim(id: string, status = MainnetClaimStatus.Queued) {
  return new MainnetClaim({
    id,
    challengeId: `challenge-${id}`,
    idempotencyKey: `idem-${id}`,
    canonicalWallet: WALLET,
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
    publicReasonCode: null,
    internalReasonCode: null,
    transactionHash: null,
    blockHash: null,
    payoutStartedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('Mainnet payout worker', () => {
  let worker: MainnetPayoutWorker;

  beforeEach(async () => {
    resetMainnetRepos();
    gearMockState.reset();
    worker = new MainnetPayoutWorker();
    await worker.init();
  });

  afterEach(() => {
    config.mainnet.emergencyPause = false;
    config.mainnet.accountSeed = '//Alice';
    config.mainnet.genesis = process.env.VARA_MAINNET_GENESIS as `0x${string}`;
    config.mainnet.providerAddresses = ['wss://rpc.vara.network'];
    config.mainnet.maxPayouts1h = 10;
    config.mainnet.maxPayouts24h = 100;
    worker.stop();
  });

  it.each([
    ['missing seed', undefined, process.env.VARA_MAINNET_GENESIS, 'VARA_MAINNET_ACCOUNT_SEED'],
    ['missing genesis', '//Alice', undefined, 'VARA_MAINNET_GENESIS'],
  ])('fails worker initialization with %s', async (_, seed, genesis, message) => {
    config.mainnet.accountSeed = seed;
    config.mainnet.genesis = genesis as `0x${string}` | undefined;

    await expect(new MainnetPayoutWorker().init()).rejects.toThrow(message);
  });

  it('rejects an empty provider address', async () => {
    config.mainnet.providerAddresses = [''];
    await expect(new MainnetPayoutWorker().init()).rejects.toThrow('VARA_MAINNET_PROVIDER');
  });

  it('rejects an unexpected chain genesis', async () => {
    gearMockState.genesisHash = '0x2222222222222222222222222222222222222222222222222222222222222222';
    await expect(new MainnetPayoutWorker().init()).rejects.toThrow('unexpected mainnet genesis');
  });

  it.each([
    ['raw seed', `0x${'11'.repeat(32)}`],
    ['mnemonic', mnemonicGenerate()],
  ])('initializes an account from a %s', async (_, seed) => {
    config.mainnet.accountSeed = seed;
    const seededWorker = new MainnetPayoutWorker();
    await expect(seededWorker.init()).resolves.toBeUndefined();
    seededWorker.stop();
  });

  it('isolates cron callback failures and disconnect failures', async () => {
    const tick = vi.spyOn(worker, 'tick').mockRejectedValueOnce(new Error('tick failed'));
    worker.run();
    await (worker as any)._job.fireOnTick();
    expect(tick).toHaveBeenCalled();

    gearMockState.disconnectFails = true;
    expect(() => worker.stop()).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('moves a queued claim to finalized after finalized transfer event', async () => {
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.Finalized);
    expect(stored.transactionHash).toBe('0xTX');
    expect(stored.blockHash).toBe('0xFINALIZED');
    expect(stored.internalReasonCode).toBeNull();
    expect(stored.payoutStartedAt).toBeInstanceOf(Date);
    expect(gearMockState.lastTransferAddress).toBe(WALLET);
    expect(Object.values(repos.MainnetClaimEvent._data()).map(({ toStatus }) => toStatus)).toEqual([
      MainnetClaimStatus.Submitting,
      MainnetClaimStatus.Submitted,
      MainnetClaimStatus.InBlock,
      MainnetClaimStatus.Finalized,
    ]);
  });

  it.each([
    'omitTxHash',
    'asyncSuccess',
    'duplicateFinal',
  ] as const)('finalizes successfully in %s callback mode', async (mode) => {
    gearMockState.transferMode = mode;
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.Finalized,
      transactionHash: '0xTX',
    });
  });

  it('unsubscribes when callback settlement wins the subscription race', async () => {
    gearMockState.transferMode = 'lateUnsubscribe';
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();
    await new Promise((resolve) => setTimeout(resolve, 550));

    expect(repos.MainnetClaim._data()['claim-1'].status).toBe(MainnetClaimStatus.Finalized);
  });

  it('fails safely when persisting a submission callback throws', async () => {
    gearMockState.transferMode = 'callbackError';
    await repos.MainnetClaim.save(claim('claim-1'));
    (AppDataSource.transaction as any)
      .mockImplementationOnce(async (callback: any) => callback(AppDataSource))
      .mockRejectedValueOnce(new Error('status write failed'));

    await worker.tick();

    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.FailedTerminal,
      internalReasonCode: 'transfer_failed',
    });
  });

  it('keeps queued claims pending when treasury balance is below minimum', async () => {
    gearMockState.freeBalance = '1';
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.Queued);
    expect(stored.internalReasonCode).toBeNull();
    expect(stored.transactionHash).toBeNull();
  });

  it('holds ambiguous submit failures for reconciliation', async () => {
    gearMockState.transferMode = 'submitFailed';
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.ReconciliationRequired);
    expect(stored.internalReasonCode).toBe('submit_failed');
  });

  it('marks finalized transactions without a matching Transfer event as failed_terminal', async () => {
    gearMockState.transferMode = 'missingTransfer';
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.FailedTerminal);
    expect(stored.internalReasonCode).toBe('transfer_event_missing');
  });

  it('marks extrinsic failures as failed_terminal', async () => {
    gearMockState.transferMode = 'extrinsicFailed';
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.FailedTerminal);
    expect(stored.internalReasonCode).toBe('extrinsic_failed');
  });

  it('does not claim queued payouts while emergency pause is enabled', async () => {
    config.mainnet.emergencyPause = true;
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.Queued);
    expect(stored.transactionHash).toBeNull();
  });

  it('returns immediately when another tick is running', async () => {
    (worker as any)._running = true;
    await expect(worker.tick()).resolves.toBeUndefined();
    (worker as any)._running = false;
  });

  it('handles an empty payout queue', async () => {
    await expect(worker.tick()).resolves.toBeUndefined();
    expect(Object.values(repos.MainnetClaimEvent._data())).toHaveLength(0);
  });

  it('keeps claims queued when the hourly treasury cap is exhausted', async () => {
    config.mainnet.maxPayouts1h = 0;
    await repos.MainnetClaim.save(claim('claim-1'));

    await worker.tick();

    expect(repos.MainnetClaim._data()['claim-1'].status).toBe(MainnetClaimStatus.Queued);
  });

  it('moves stale submitting claims to reconciliation_required during reconciliation', async () => {
    const stale = claim('claim-1', MainnetClaimStatus.Submitting);
    stale.updatedAt = new Date(Date.now() - config.mainnet.reconciliationGraceMs - 1);
    await repos.MainnetClaim.save(stale);

    await worker.reconcile();

    const stored = repos.MainnetClaim._data()['claim-1'];
    expect(stored.status).toBe(MainnetClaimStatus.ReconciliationRequired);
    expect(stored.internalReasonCode).toBe('worker_restarted_before_submission');
  });

  it('does not reconcile a submission that is still inside its grace period', async () => {
    await repos.MainnetClaim.save(claim('claim-1', MainnetClaimStatus.Submitting));

    await worker.reconcile();

    expect(repos.MainnetClaim._data()['claim-1'].status).toBe(MainnetClaimStatus.Submitting);
  });

  it('does not retry submitted or in_block claims during reconciliation', async () => {
    await repos.MainnetClaim.save(claim('submitted', MainnetClaimStatus.Submitted));
    await repos.MainnetClaim.save(claim('in-block', MainnetClaimStatus.InBlock));

    await worker.reconcile();

    expect(repos.MainnetClaim._data().submitted.status).toBe(MainnetClaimStatus.Submitted);
    expect(repos.MainnetClaim._data()['in-block'].status).toBe(MainnetClaimStatus.InBlock);
  });

  it('finalizes a submitted claim found in finalized chain history', async () => {
    const pending = claim('submitted', MainnetClaimStatus.Submitted);
    pending.transactionHash = gearMockState.reconciliationTxHash;
    await repos.MainnetClaim.save(pending);
    gearMockState.reconciliationMode = 'success';

    await worker.reconcile();

    const stored = repos.MainnetClaim._data().submitted;
    expect(stored.status).toBe(MainnetClaimStatus.Finalized);
    expect(stored.blockHash).toBe('0xBLOCK10');
  });

  it('marks a finalized failed extrinsic as failed_terminal during reconciliation', async () => {
    const pending = claim('submitted', MainnetClaimStatus.Submitted);
    pending.transactionHash = gearMockState.reconciliationTxHash;
    await repos.MainnetClaim.save(pending);
    gearMockState.reconciliationMode = 'extrinsicFailed';

    await worker.reconcile();

    const stored = repos.MainnetClaim._data().submitted;
    expect(stored.status).toBe(MainnetClaimStatus.FailedTerminal);
    expect(stored.internalReasonCode).toBe('extrinsic_failed');
  });

  it('marks a finalized transaction without its transfer event as failed_terminal during reconciliation', async () => {
    const pending = claim('submitted', MainnetClaimStatus.Submitted);
    pending.transactionHash = gearMockState.reconciliationTxHash;
    await repos.MainnetClaim.save(pending);
    gearMockState.reconciliationMode = 'missingTransfer';

    await worker.reconcile();

    const stored = repos.MainnetClaim._data().submitted;
    expect(stored.status).toBe(MainnetClaimStatus.FailedTerminal);
    expect(stored.internalReasonCode).toBe('transfer_event_missing');
  });

  it('leaves a recent transaction pending when it is not yet finalized', async () => {
    const pending = claim('submitted', MainnetClaimStatus.Submitted);
    pending.transactionHash = '0xNOT_FOUND';
    await repos.MainnetClaim.save(pending);

    await worker.reconcile();

    expect(repos.MainnetClaim._data().submitted.status).toBe(MainnetClaimStatus.Submitted);
  });

  it('uses transfer_failed when processing throws without a reason code', async () => {
    const pending = claim('claim-1', MainnetClaimStatus.Submitting);
    await repos.MainnetClaim.save(pending);
    (worker as any)._sendTransfer = vi.fn().mockRejectedValue(new Error('unexpected'));

    await (worker as any)._processClaim(pending);

    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.FailedTerminal,
      internalReasonCode: 'transfer_failed',
    });
  });

  it('does not transition a missing claim or a claim in an unexpected status', async () => {
    await expect((worker as any)._transitionClaim('missing', MainnetClaimStatus.Finalized, {})).resolves.toBe(false);
    const queued = claim('claim-1');
    await repos.MainnetClaim.save(queued);
    await expect(
      (worker as any)._transitionClaim('claim-1', MainnetClaimStatus.Finalized, {}, [MainnetClaimStatus.InBlock]),
    ).resolves.toBe(false);
  });

  it('guards private chain operations before initialization', async () => {
    const uninitialized = new MainnetPayoutWorker();
    await expect((uninitialized as any)._processClaim(claim('one'))).rejects.toThrow('not initialized');
    await expect((uninitialized as any)._sendTransfer('one', WALLET)).rejects.toThrow('not initialized');
    await expect((uninitialized as any)._getFreeBalance()).rejects.toThrow('not initialized');
    await expect((uninitialized as any)._findFinalizedOutcomes([])).rejects.toThrow('not initialized');
  });

  it('holds an old transaction absent from finalized history for manual reconciliation', async () => {
    const pending = claim('submitted', MainnetClaimStatus.Submitted);
    pending.transactionHash = '0xNOT_FOUND';
    pending.updatedAt = new Date(Date.now() - config.mainnet.reconciliationGraceMs - 1);
    await repos.MainnetClaim.save(pending);

    await worker.reconcile();

    const stored = repos.MainnetClaim._data().submitted;
    expect(stored.status).toBe(MainnetClaimStatus.ReconciliationRequired);
    expect(stored.internalReasonCode).toBe('transaction_not_found_in_finalized_history');
  });
});
