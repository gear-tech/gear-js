import { randomUUID } from 'node:crypto';
import { createLogger } from 'gear-idea-common';

import { AppDataSource, MainnetClaim, MainnetClaimEvent, MainnetClaimStatus } from '../database/index.js';
import { MainnetFaucetError } from './mainnet.js';

const logger = createLogger('mainnet-admin');

export type MainnetReconciliationAction = 'mark_finalized' | 'mark_failed_terminal' | 'requeue';

export interface MainnetReconciliationRequest {
  claimId: string;
  action: MainnetReconciliationAction;
  operator?: string;
  note?: string;
  transactionHash?: string;
  blockHash?: string;
  reasonCode?: string;
}

export class MainnetAdminService {
  public async listReconciliation() {
    const claims = await AppDataSource.getRepository(MainnetClaim).find({
      where: { status: MainnetClaimStatus.ReconciliationRequired },
      order: { updatedAt: 'ASC' },
      take: 50,
    });

    return claims.map(toReconciliationDto);
  }

  public async resolveReconciliation(request: MainnetReconciliationRequest) {
    const operator = normalizeText(request.operator) ?? 'unknown';
    const note = normalizeText(request.note);

    return AppDataSource.transaction(async (manager) => {
      const repo = manager.getRepository(MainnetClaim);
      const claim = await repo.findOne({
        where: { id: request.claimId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!claim) throw new MainnetFaucetError(404, 'claim_not_found');
      if (claim.status !== MainnetClaimStatus.ReconciliationRequired) {
        throw new MainnetFaucetError(409, 'invalid_status', 'claim_is_not_reconciliation_required');
      }

      const fromStatus = claim.status;
      const metadata = {
        action: request.action,
        operator,
        ...(note ? { note } : {}),
        ...(claim.transactionHash ? { previousTransactionHash: claim.transactionHash } : {}),
        ...(claim.blockHash ? { previousBlockHash: claim.blockHash } : {}),
      };

      if (request.action === 'mark_finalized') {
        const transactionHash = requireText(request.transactionHash, 'missing_transaction_hash');
        const blockHash = requireText(request.blockHash, 'missing_block_hash');
        Object.assign(claim, {
          status: MainnetClaimStatus.Finalized,
          transactionHash,
          blockHash,
          publicReasonCode: null,
          internalReasonCode: null,
          updatedAt: new Date(),
        });
      } else if (request.action === 'mark_failed_terminal') {
        const reasonCode = requireText(request.reasonCode, 'missing_reason_code');
        Object.assign(claim, {
          status: MainnetClaimStatus.FailedTerminal,
          internalReasonCode: reasonCode,
          publicReasonCode: null,
          updatedAt: new Date(),
        });
      } else if (request.action === 'requeue') {
        if (claim.transactionHash) {
          throw new MainnetFaucetError(409, 'unsafe_requeue', 'cannot_requeue_claim_with_transaction_hash');
        }
        Object.assign(claim, {
          status: MainnetClaimStatus.Queued,
          publicReasonCode: null,
          internalReasonCode: null,
          blockHash: null,
          payoutStartedAt: null,
          updatedAt: new Date(),
        });
      } else {
        throw new MainnetFaucetError(400, 'invalid_action');
      }

      await repo.save(claim);
      await manager.getRepository(MainnetClaimEvent).save(
        new MainnetClaimEvent({
          id: randomUUID(),
          claimId: claim.id,
          fromStatus,
          toStatus: claim.status,
          reasonCode: claim.internalReasonCode,
          metadata,
          createdAt: new Date(),
        }),
      );

      logger.info('Mainnet reconciliation resolved', {
        claimId: claim.id,
        action: request.action,
        operator,
        toStatus: claim.status,
      });
      return toReconciliationDto(claim);
    });
  }
}

function toReconciliationDto(claim: MainnetClaim) {
  return {
    claimId: claim.id,
    status: claim.status,
    amount: claim.amount,
    address: claim.address,
    canonicalWallet: claim.canonicalWallet,
    transactionHash: claim.transactionHash,
    blockHash: claim.blockHash,
    internalReasonCode: claim.internalReasonCode,
    payoutStartedAt: claim.payoutStartedAt,
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
  };
}

function requireText(value: string | undefined, publicCode: string) {
  const normalized = normalizeText(value);
  if (!normalized) throw new MainnetFaucetError(400, publicCode);
  return normalized;
}

function normalizeText(value: string | undefined) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 512) : undefined;
}
