import { randomUUID } from 'node:crypto';
import { GearApi, GearKeyring, type TransferData } from '@gear-js/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { CronJob } from 'cron';
import { createLogger } from 'gear-idea-common';
import { type EntityManager, In } from 'typeorm';

import config from '../config.js';
import { AppDataSource, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../database/index.js';
import { recordMainnetPayout } from './mainnet-metrics.js';
import { parseVaraAmount } from './mainnet-utils.js';

const logger = createLogger('mainnet-payout-worker');
const TRANSFER_EVENT = 'Transfer';
const EXTRINSIC_FAILED_EVENT = 'ExtrinsicFailed';
const TREASURY_ADVISORY_LOCK_ID = 1_780_000_001;

export class MainnetPayoutWorker {
  private _job: CronJob<any, this>;
  private _api?: GearApi;
  private _account: KeyringPair;
  private _providerAddress: string;
  private _amount = new BN(parseVaraAmount(config.mainnet.transferValue));
  private _running = false;

  public async init() {
    if (!config.mainnet.accountSeed) {
      throw new Error('VARA_MAINNET_ACCOUNT_SEED is required for payout worker');
    }
    if (!config.mainnet.genesis) throw new Error('VARA_MAINNET_GENESIS is required for payout worker');

    this._providerAddress = config.mainnet.providerAddresses[0];
    this._account = await createAccount(config.mainnet.accountSeed);
    logger.info('Mainnet payout account created', { address: this._account.address });

    await this._connect();
    await this.reconcile();
  }

  public run() {
    this._job = new CronJob(
      config.mainnet.workerCronTime,
      async () => {
        try {
          await this.tick();
        } catch (error: any) {
          logger.error('Worker tick failed', { error: error.message, stack: error.stack });
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
    Promise.resolve(this._api?.disconnect()).catch((error) =>
      logger.warn('Failed to disconnect API', { error: error.message }),
    );
  }

  public async reconcile() {
    const repo = AppDataSource.getRepository(MainnetClaim);
    const staleSubmitting = await repo.find({
      where: { status: In([MainnetClaimStatus.Submitting]) },
    });

    const ambiguousSubmitting = staleSubmitting.filter(
      ({ updatedAt }) => Date.now() - updatedAt.getTime() >= config.mainnet.reconciliationGraceMs,
    );
    if (ambiguousSubmitting.length > 0) {
      for (const claim of ambiguousSubmitting) {
        await this._transitionClaim(claim.id, MainnetClaimStatus.ReconciliationRequired, {
          internalReasonCode: 'worker_restarted_before_submission',
          publicReasonCode: null,
        });
      }
      logger.warn('Moved ambiguous submitting claims to reconciliation_required', {
        count: ambiguousSubmitting.length,
      });
    }

    const pendingChainClaims = await repo.find({
      where: { status: In([MainnetClaimStatus.Submitted, MainnetClaimStatus.InBlock]) },
    });
    if (pendingChainClaims.length === 0) return;

    const outcomes = await this._findFinalizedOutcomes(pendingChainClaims);
    for (const claim of pendingChainClaims) {
      const outcome = outcomes.get(claim.transactionHash ?? '');
      if (outcome?.transferred) {
        await this._transitionClaim(claim.id, MainnetClaimStatus.Finalized, {
          blockHash: outcome.blockHash,
          internalReasonCode: null,
          publicReasonCode: null,
        });
      } else if (outcome) {
        await this._transitionClaim(claim.id, MainnetClaimStatus.FailedTerminal, {
          blockHash: outcome.blockHash,
          internalReasonCode: outcome.reason,
        });
      } else if (Date.now() - claim.updatedAt.getTime() >= config.mainnet.reconciliationGraceMs) {
        await this._transitionClaim(claim.id, MainnetClaimStatus.ReconciliationRequired, {
          internalReasonCode: 'transaction_not_found_in_finalized_history',
        });
      }
    }
  }

  public async tick() {
    if (this._running) return;
    this._running = true;

    try {
      if (config.mainnet.emergencyPause) {
        logger.warn('Emergency pause enabled, skipping payout tick');
        return;
      }

      await this.reconcile();
      const claims = await this._claimQueuedBatch();
      for (const claim of claims) {
        await this._processClaim(claim);
      }
    } finally {
      this._running = false;
    }
  }

  private async _claimQueuedBatch() {
    return AppDataSource.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock($1)', [TREASURY_ADVISORY_LOCK_ID]);
      const claims = await manager
        .getRepository(MainnetClaim)
        .createQueryBuilder('claim')
        .where('claim.status = :status', { status: MainnetClaimStatus.Queued })
        .orderBy('claim."createdAt"', 'ASC')
        .limit(config.mainnet.workerBatchSize)
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getMany();

      if (claims.length === 0) return [];
      const allowed = await this._applyTreasuryLimits(manager, claims);
      const now = new Date();

      for (const claim of allowed) {
        await this._transitionClaimWithManager(manager, claim, MainnetClaimStatus.Submitting, {
          publicReasonCode: null,
          internalReasonCode: null,
          payoutStartedAt: now,
          updatedAt: now,
        });
      }

      return allowed;
    });
  }

  private async _applyTreasuryLimits(manager: EntityManager, claims: MainnetClaim[]) {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const finalizedStatuses = [
      MainnetClaimStatus.Submitting,
      MainnetClaimStatus.Submitted,
      MainnetClaimStatus.InBlock,
      MainnetClaimStatus.Finalized,
    ];
    const repo = manager.getRepository(MainnetClaim);
    const [hourCount, dayCount, amount24h] = await Promise.all([
      repo
        .createQueryBuilder('claim')
        .where('claim."payoutStartedAt" >= :hourAgo', { hourAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: finalizedStatuses })
        .getCount(),
      repo
        .createQueryBuilder('claim')
        .where('claim."payoutStartedAt" >= :dayAgo', { dayAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: finalizedStatuses })
        .getCount(),
      repo
        .createQueryBuilder('claim')
        .select('COALESCE(SUM(claim.amount), 0)', 'sum')
        .where('claim."payoutStartedAt" >= :dayAgo', { dayAgo })
        .andWhere('claim.status IN (:...statuses)', { statuses: finalizedStatuses })
        .getRawOne<{ sum: string }>(),
    ]);

    const availableByHour = Math.max(config.mainnet.maxPayouts1h - hourCount, 0);
    const availableByDay = Math.max(config.mainnet.maxPayouts24h - dayCount, 0);
    const spentToday = BigInt(amount24h!.sum);
    const dailyAmountLimit = BigInt(parseVaraAmount(config.mainnet.maxAmount24h));
    const availableByAmount = Number((dailyAmountLimit - spentToday) / BigInt(this._amount.toString()));
    const payoutSlots = Math.max(Math.min(availableByHour, availableByDay, availableByAmount), 0);

    if (payoutSlots === 0) {
      logger.warn('Treasury limits blocked queued claims', { hourCount, dayCount, amount24h: amount24h!.sum });
      return [];
    }

    const balance = await this._getFreeBalance();
    const minBalance = new BN(parseVaraAmount(config.mainnet.minBalance));
    const maxByBalance = balance.sub(minBalance).div(this._amount).toNumber();

    if (maxByBalance <= 0) {
      logger.warn('Treasury balance is below payout threshold', {
        balance: balance.toString(),
        minBalance: minBalance.toString(),
      });
      return [];
    }

    return claims.slice(0, Math.min(payoutSlots, maxByBalance));
  }

  private async _processClaim(claim: MainnetClaim) {
    if (!this._api) throw new Error('GearApi is not initialized');

    try {
      const transfer = await this._sendTransfer(claim.id, claim.canonicalWallet);

      await this._transitionClaim(
        claim.id,
        MainnetClaimStatus.Finalized,
        {
          transactionHash: transfer.transactionHash,
          blockHash: transfer.blockHash,
          internalReasonCode: null,
          publicReasonCode: null,
          updatedAt: new Date(),
        },
        [MainnetClaimStatus.Submitted, MainnetClaimStatus.InBlock],
      );
      recordMainnetPayout('finalized');
      logger.info('Claim finalized', {
        claimId: claim.id,
        transactionHash: transfer.transactionHash,
        blockHash: transfer.blockHash,
      });
    } catch (error: any) {
      const status = error.retryable ? MainnetClaimStatus.ReconciliationRequired : MainnetClaimStatus.FailedTerminal;
      await this._transitionClaim(
        claim.id,
        status,
        {
          internalReasonCode: error.reason ?? 'transfer_failed',
          updatedAt: new Date(),
        },
        [MainnetClaimStatus.Submitting, MainnetClaimStatus.Submitted, MainnetClaimStatus.InBlock],
      );
      recordMainnetPayout(status);
      logger.error('Claim payout failed', { claimId: claim.id, error: error.message, reason: error.reason });
    }
  }

  private async _sendTransfer(claimId: string, address: string) {
    if (!this._api) throw new Error('GearApi is not initialized');

    const tx = this._api.tx.balances.transferKeepAlive(address, this._amount);
    let transactionHash: string | null = null;
    let blockHash: string | null = null;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      let unsubscribe: (() => void) | undefined;
      let callbackQueue = Promise.resolve();

      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        unsubscribe?.();
        error ? reject(error) : resolve();
      };

      const handleResult = async (result: any) => {
        transactionHash = result.txHash?.toHex?.() ?? tx.hash.toHex();

        await this._transitionClaim(claimId, MainnetClaimStatus.Submitted, { transactionHash, updatedAt: new Date() }, [
          MainnetClaimStatus.Submitting,
        ]);

        if (result.status?.isInBlock) {
          blockHash = result.status.asInBlock.toHex();
          await this._transitionClaim(
            claimId,
            MainnetClaimStatus.InBlock,
            { transactionHash, blockHash, updatedAt: new Date() },
            [MainnetClaimStatus.Submitted],
          );
        }

        if (!result.status?.isFinalized) return;
        blockHash = result.status.asFinalized.toHex();
        let transferred = false;

        for (const { event } of result.events ?? []) {
          const data = event.data as TransferData;
          if (
            event.method === TRANSFER_EVENT &&
            data.to.toHex() === address &&
            data.amount.toString() === this._amount.toString()
          ) {
            transferred = true;
          }
          if (event.method === EXTRINSIC_FAILED_EVENT) {
            finish(Object.assign(new Error('Extrinsic failed'), { reason: 'extrinsic_failed', retryable: false }));
            return;
          }
        }

        if (!transferred) {
          finish(
            Object.assign(new Error('Transfer event was not found'), {
              reason: 'transfer_event_missing',
              retryable: false,
            }),
          );
          return;
        }

        finish();
      };

      tx.signAndSend(this._account, (result: any) => {
        callbackQueue = callbackQueue.then(() => handleResult(result)).catch((error) => finish(error));
      })
        .then((unsub: () => void) => {
          unsubscribe = unsub;
          if (settled) unsubscribe?.();
        })
        .catch((error: Error) => finish(Object.assign(error, { reason: 'submit_failed', retryable: true })));
    });

    return { transactionHash: transactionHash!, blockHash: blockHash! };
  }

  private async _connect() {
    if (!this._providerAddress) throw new Error('VARA_MAINNET_PROVIDER is required');

    this._api = new GearApi({ providerAddress: this._providerAddress, noInitWarn: true });
    await this._api.isReadyOrError;
    const genesis = this._api.genesisHash.toHex();

    if (config.mainnet.genesis && genesis !== config.mainnet.genesis) {
      throw new Error(`Connected to unexpected mainnet genesis: ${genesis}`);
    }

    logger.info(`Connected to ${await this._api.chain()}`, { genesis });
  }

  private async _getFreeBalance() {
    if (!this._api) throw new Error('GearApi is not initialized');
    const account = (await this._api.query.system.account(this._account.address)) as any;
    return new BN(account.data.free.toString());
  }

  private async _findFinalizedOutcomes(claims: MainnetClaim[]) {
    if (!this._api) throw new Error('GearApi is not initialized');

    const claimsByHash = new Map(
      claims.filter(({ transactionHash }) => transactionHash).map((claim) => [claim.transactionHash!, claim]),
    );
    const outcomes = new Map<string, { transferred: boolean; blockHash: string; reason: string | null }>();
    if (claimsByHash.size === 0) return outcomes;

    const finalizedHash = await this._api.rpc.chain.getFinalizedHead();
    const finalizedHeader = await this._api.rpc.chain.getHeader(finalizedHash);
    const finalizedNumber = finalizedHeader.number.toNumber();
    const firstBlock = Math.max(finalizedNumber - config.mainnet.reconciliationLookbackBlocks + 1, 0);

    for (
      let blockNumber = finalizedNumber;
      blockNumber >= firstBlock && outcomes.size < claimsByHash.size;
      blockNumber--
    ) {
      const blockHashCodec = await this._api.rpc.chain.getBlockHash(blockNumber);
      const blockHash = blockHashCodec.toHex();
      const signedBlock = await this._api.rpc.chain.getBlock(blockHashCodec);
      const matches = signedBlock.block.extrinsics
        .map((extrinsic, index) => ({ index, transactionHash: extrinsic.hash.toHex() }))
        .filter(({ transactionHash }) => claimsByHash.has(transactionHash) && !outcomes.has(transactionHash));
      if (matches.length === 0) continue;

      const eventRecords = Array.from((await this._api.query.system.events.at(blockHashCodec)) as any) as any[];
      for (const { index, transactionHash } of matches) {
        const claim = claimsByHash.get(transactionHash)!;
        const events = eventRecords
          .filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.toNumber() === index)
          .map(({ event }) => event);
        const failed = events.some(({ method }) => method === EXTRINSIC_FAILED_EVENT);
        const transferred = events.some(({ method, data }) => {
          if (method !== TRANSFER_EVENT) return false;
          const transfer = data as TransferData;
          return transfer.to.toHex() === claim.canonicalWallet && transfer.amount.toString() === claim.amount;
        });
        outcomes.set(transactionHash, {
          transferred: !failed && transferred,
          blockHash,
          reason: failed ? 'extrinsic_failed' : transferred ? null : 'transfer_event_missing',
        });
      }
    }

    return outcomes;
  }

  private async _transitionClaim(
    claimId: string,
    toStatus: MainnetClaimStatus,
    patch: Partial<MainnetClaim>,
    expectedStatuses?: MainnetClaimStatus[],
  ) {
    return AppDataSource.transaction(async (manager) => {
      const claim = await manager.getRepository(MainnetClaim).findOne({
        where: { id: claimId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!claim || (expectedStatuses && !expectedStatuses.includes(claim.status))) return false;
      await this._transitionClaimWithManager(manager, claim, toStatus, patch);
      return true;
    });
  }

  private async _transitionClaimWithManager(
    manager: EntityManager,
    claim: MainnetClaim,
    toStatus: MainnetClaimStatus,
    patch: Partial<MainnetClaim>,
  ) {
    const fromStatus = claim.status;
    Object.assign(claim, patch, { status: toStatus, updatedAt: patch.updatedAt ?? new Date() });
    await manager.getRepository(MainnetClaim).save(claim);
    await manager.getRepository(MainnetClaimEvent).save(
      new MainnetClaimEvent({
        id: randomUUID(),
        claimId: claim.id,
        fromStatus,
        toStatus,
        reasonCode: claim.internalReasonCode,
        metadata: {
          ...(claim.transactionHash ? { transactionHash: claim.transactionHash } : {}),
          ...(claim.blockHash ? { blockHash: claim.blockHash } : {}),
        },
        createdAt: new Date(),
      }),
    );
  }
}

async function createAccount(seed: string): Promise<KeyringPair> {
  if (seed.startsWith('//')) {
    return GearKeyring.fromSuri(seed);
  }
  if (seed.startsWith('0x')) {
    return GearKeyring.fromSeed(seed);
  }

  return GearKeyring.fromMnemonic(seed);
}
