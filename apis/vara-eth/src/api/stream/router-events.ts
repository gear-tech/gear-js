import type { Address, Hex, Log, PublicClient } from 'viem';

import { IROUTER_ABI } from '../../eth/abi/IRouter.js';
import type { EventMeta, RouterEvent, StreamHandlers, Unsubscribe } from './types.js';

/**
 * Options accepted by {@link watchRouterEvents}.
 */
export interface WatchRouterEventsOptions {
  /** Optional block number to start streaming from (back-fills historical logs). */
  fromBlock?: bigint;
}

function buildMeta(log: Log): EventMeta | null {
  if (log.blockNumber === null || log.blockHash === null || log.transactionHash === null) return null;
  if (log.transactionIndex === null || log.logIndex === null) return null;
  return {
    blockNumber: log.blockNumber,
    blockHash: log.blockHash,
    txHash: log.transactionHash,
    txIndex: log.transactionIndex,
    logIndex: log.logIndex,
  };
}

function decodeRouterLog(log: Log): RouterEvent | null {
  const meta = buildMeta(log);
  if (meta === null) return null;

  const eventName = (log as { eventName?: string }).eventName;
  const args = (log as { args?: Record<string, unknown> }).args ?? {};
  if (!eventName) return null;

  switch (eventName) {
    case 'AnnouncesCommitted':
      return { ...meta, type: 'AnnouncesCommitted', head: args.head as Hex };
    case 'BatchCommitted':
      return { ...meta, type: 'BatchCommitted', hash: args.hash as Hex };
    case 'CodeGotValidated':
      return {
        ...meta,
        type: 'CodeGotValidated',
        codeId: args.codeId as Hex,
        valid: args.valid as boolean,
      };
    case 'CodeValidationRequested':
      return { ...meta, type: 'CodeValidationRequested', codeId: args.codeId as Hex };
    case 'ComputationSettingsChanged':
      return {
        ...meta,
        type: 'ComputationSettingsChanged',
        threshold: args.threshold as bigint,
        wvaraPerSecond: args.wvaraPerSecond as bigint,
      };
    case 'Initialized':
      return { ...meta, type: 'Initialized', version: args.version as bigint };
    case 'OwnershipTransferred':
      return {
        ...meta,
        type: 'OwnershipTransferred',
        previousOwner: args.previousOwner as Address,
        newOwner: args.newOwner as Address,
      };
    case 'Paused':
      return { ...meta, type: 'Paused', account: args.account as Address };
    case 'ProgramCreated':
      return {
        ...meta,
        type: 'ProgramCreated',
        actorId: args.actorId as Address,
        codeId: args.codeId as Hex,
      };
    case 'StorageSlotChanged':
      return { ...meta, type: 'StorageSlotChanged', slot: args.slot as Hex };
    case 'Unpaused':
      return { ...meta, type: 'Unpaused', account: args.account as Address };
    case 'Upgraded':
      return { ...meta, type: 'Upgraded', implementation: args.implementation as Address };
    case 'ValidatorsCommittedForEra':
      return { ...meta, type: 'ValidatorsCommittedForEra', eraIndex: args.eraIndex as bigint };
    default:
      return null;
  }
}

/**
 * Subscribes to all events emitted by the Router contract and dispatches them
 * through a typed discriminated union.
 *
 * Wraps viem's `publicClient.watchContractEvent` — re-connection and polling
 * fallback are handled by viem internally.
 *
 * @param publicClient - viem PublicClient
 * @param router - the Router contract address (typically `ethClient.router.address`)
 * @param handlers - {@link StreamHandlers}
 * @param options - {@link WatchRouterEventsOptions}
 * @returns {@link Unsubscribe} call this to stop the stream
 */
export function watchRouterEvents(
  publicClient: PublicClient,
  router: Address,
  handlers: StreamHandlers<RouterEvent>,
  options: WatchRouterEventsOptions = {},
): Unsubscribe {
  return publicClient.watchContractEvent({
    address: router,
    abi: IROUTER_ABI,
    fromBlock: options.fromBlock,
    onLogs: (logs) => {
      for (const log of logs) {
        const event = decodeRouterLog(log);
        if (event !== null) handlers.onEvent(event);
      }
    },
    onError: handlers.onError,
  });
}
