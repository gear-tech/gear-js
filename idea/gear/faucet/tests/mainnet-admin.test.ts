import { MainnetClaim, MainnetClaimStatus } from '../src/database/index.js';
import { MainnetAdminService } from '../src/services/index.js';
import { repos } from './__mocks__/db.js';

const AMOUNT = '50000000000000';
const WALLET = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function resetMainnetRepos() {
  repos.MainnetChallenge.clear();
  repos.MainnetClaim.clear();
  repos.MainnetClaimEvent.clear();
}

function claim(id: string, status = MainnetClaimStatus.ReconciliationRequired) {
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
    internalReasonCode: 'needs_operator_review',
    transactionHash: null,
    blockHash: null,
    payoutStartedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('Mainnet admin service', () => {
  let service: MainnetAdminService;

  beforeEach(() => {
    resetMainnetRepos();
    service = new MainnetAdminService();
  });

  it('lists claims that require operator reconciliation', async () => {
    await repos.MainnetClaim.save(claim('claim-1'));
    await repos.MainnetClaim.save(claim('claim-2', MainnetClaimStatus.Queued));

    await expect(service.listReconciliation()).resolves.toEqual([
      expect.objectContaining({
        claimId: 'claim-1',
        status: MainnetClaimStatus.ReconciliationRequired,
        amount: AMOUNT,
        canonicalWallet: WALLET,
        internalReasonCode: 'needs_operator_review',
      }),
    ]);
  });

  it('marks a reconciled claim as finalized with operator audit metadata', async () => {
    await repos.MainnetClaim.save(claim('claim-1'));

    const resolved = await service.resolveReconciliation({
      claimId: 'claim-1',
      action: 'mark_finalized',
      transactionHash: '0xTX',
      blockHash: '0xBLOCK',
      operator: ' timur ',
      note: ' verified on explorer ',
    });

    expect(resolved.status).toBe(MainnetClaimStatus.Finalized);
    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.Finalized,
      transactionHash: '0xTX',
      blockHash: '0xBLOCK',
      internalReasonCode: null,
      publicReasonCode: null,
    });
    expect(Object.values(repos.MainnetClaimEvent._data())).toEqual([
      expect.objectContaining({
        claimId: 'claim-1',
        fromStatus: MainnetClaimStatus.ReconciliationRequired,
        toStatus: MainnetClaimStatus.Finalized,
        reasonCode: null,
        metadata: {
          action: 'mark_finalized',
          operator: 'timur',
          note: 'verified on explorer',
        },
      }),
    ]);
  });

  it('marks a reconciled claim as failed_terminal with the operator reason', async () => {
    const c = claim('claim-1');
    c.transactionHash = '0xTX';
    c.blockHash = '0xBLOCK';
    await repos.MainnetClaim.save(c);

    await service.resolveReconciliation({
      claimId: 'claim-1',
      action: 'mark_failed_terminal',
      reasonCode: 'recipient_transfer_not_found',
    });

    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.FailedTerminal,
      internalReasonCode: 'recipient_transfer_not_found',
      publicReasonCode: null,
    });
    expect(Object.values(repos.MainnetClaimEvent._data())[0]).toMatchObject({
      reasonCode: 'recipient_transfer_not_found',
      metadata: {
        action: 'mark_failed_terminal',
        operator: 'unknown',
        previousTransactionHash: '0xTX',
        previousBlockHash: '0xBLOCK',
      },
    });
  });

  it('requeues only reconciliation claims that do not have a transaction hash', async () => {
    const c = claim('claim-1');
    c.blockHash = '0xSTALE';
    await repos.MainnetClaim.save(c);

    await service.resolveReconciliation({ claimId: 'claim-1', action: 'requeue', operator: '' });

    expect(repos.MainnetClaim._data()['claim-1']).toMatchObject({
      status: MainnetClaimStatus.Queued,
      internalReasonCode: null,
      publicReasonCode: null,
      blockHash: null,
      payoutStartedAt: null,
    });
  });

  it.each([
    ['missing claim', { claimId: 'missing', action: 'requeue' as const }, 404, 'claim_not_found'],
    ['wrong status', { claimId: 'claim-1', action: 'requeue' as const }, 409, 'invalid_status'],
  ])('rejects reconciliation resolution for a %s', async (_, request, statusCode, publicCode) => {
    await repos.MainnetClaim.save(claim('claim-1', MainnetClaimStatus.Queued));

    await expect(service.resolveReconciliation(request)).rejects.toMatchObject({ statusCode, publicCode });
  });

  it.each([
    [
      'missing tx hash',
      { claimId: 'claim-1', action: 'mark_finalized' as const, blockHash: '0xBLOCK' },
      'missing_transaction_hash',
    ],
    [
      'missing block hash',
      { claimId: 'claim-1', action: 'mark_finalized' as const, transactionHash: '0xTX' },
      'missing_block_hash',
    ],
    [
      'missing reason',
      { claimId: 'claim-1', action: 'mark_failed_terminal' as const, reasonCode: ' ' },
      'missing_reason_code',
    ],
    ['invalid action', { claimId: 'claim-1', action: 'nope' as any }, 'invalid_action'],
  ])('rejects %s', async (_, request, publicCode) => {
    await repos.MainnetClaim.save(claim('claim-1'));

    await expect(service.resolveReconciliation(request)).rejects.toMatchObject({ statusCode: 400, publicCode });
  });

  it('rejects unsafe requeue when a transaction hash is already known', async () => {
    const c = claim('claim-1');
    c.transactionHash = '0xTX';
    await repos.MainnetClaim.save(c);

    await expect(service.resolveReconciliation({ claimId: 'claim-1', action: 'requeue' })).rejects.toMatchObject({
      statusCode: 409,
      publicCode: 'unsafe_requeue',
    });
  });
});
