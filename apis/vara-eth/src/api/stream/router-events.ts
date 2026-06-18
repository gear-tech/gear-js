import type { Address, Hex, Log, PublicClient } from 'viem';

import { IROUTER_ABI } from '../../eth/abi/IRouter.js';
import {
  decodeEventHeader,
  type RouterEvent,
  type StreamHandlers,
  type Unsubscribe,
  type WatchEventsOptions,
} from './types.js';

export type WatchRouterEventsOptions = WatchEventsOptions;

function decodeRouterLog(log: Log): RouterEvent | null {
  const header = decodeEventHeader(log);
  if (header === null) return null;
  const { eventName, meta } = header;
  const args = (log as { args?: Record<string, unknown> }).args ?? {};

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
    case 'EBCommitted':
      return { ...meta, type: 'EBCommitted', ethBlockHash: args.ethBlockHash as Hex };
    case 'EIP712DomainChanged':
      return { ...meta, type: 'EIP712DomainChanged' };
    case 'Initialized':
      return { ...meta, type: 'Initialized', version: args.version as bigint };
    case 'MBCommitted':
      return { ...meta, type: 'MBCommitted', head: args.head as Hex };
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
