import type { Address, Hex, Log, PublicClient } from 'viem';

import { IMIRROR_ABI } from '../../eth/abi/IMirror.js';
import {
  decodeEventHeader,
  type ProgramEvent,
  type StreamHandlers,
  type Unsubscribe,
  type WatchEventsOptions,
} from './types.js';

export type WatchProgramEventsOptions = WatchEventsOptions;

function decodeProgramLog(log: Log): ProgramEvent | null {
  const header = decodeEventHeader(log);
  if (header === null) return null;
  const { eventName, meta } = header;
  const args = (log as { args?: Record<string, unknown> }).args ?? {};

  switch (eventName) {
    case 'ExecutableBalanceTopUpRequested':
      return { ...meta, type: 'ExecutableBalanceTopUpRequested', value: args.value as bigint };
    case 'Message':
      return {
        ...meta,
        type: 'Message',
        id: args.id as Hex,
        destination: args.destination as Address,
        payload: args.payload as Hex,
        value: args.value as bigint,
      };
    case 'MessageCallFailed':
      return {
        ...meta,
        type: 'MessageCallFailed',
        id: args.id as Hex,
        destination: args.destination as Address,
        value: args.value as bigint,
      };
    case 'MessageQueueingRequested':
      return {
        ...meta,
        type: 'MessageQueueingRequested',
        id: args.id as Hex,
        source: args.source as Address,
        payload: args.payload as Hex,
        value: args.value as bigint,
        callReply: args.callReply as boolean,
      };
    case 'OwnedBalanceTopUpRequested':
      return { ...meta, type: 'OwnedBalanceTopUpRequested', value: args.value as bigint };
    case 'Reply':
      return {
        ...meta,
        type: 'Reply',
        payload: args.payload as Hex,
        value: args.value as bigint,
        replyTo: args.replyTo as Hex,
        replyCode: args.replyCode as Hex,
      };
    case 'ReplyCallFailed':
      return {
        ...meta,
        type: 'ReplyCallFailed',
        value: args.value as bigint,
        replyTo: args.replyTo as Hex,
        replyCode: args.replyCode as Hex,
      };
    case 'ReplyQueueingRequested':
      return {
        ...meta,
        type: 'ReplyQueueingRequested',
        repliedTo: args.repliedTo as Hex,
        source: args.source as Address,
        payload: args.payload as Hex,
        value: args.value as bigint,
      };
    case 'ReplyTransferFailed':
      return {
        ...meta,
        type: 'ReplyTransferFailed',
        destination: args.destination as Address,
        value: args.value as bigint,
      };
    case 'StateChanged':
      return { ...meta, type: 'StateChanged', stateHash: args.stateHash as Hex };
    case 'TransferLockedValueToInheritorFailed':
      return {
        ...meta,
        type: 'TransferLockedValueToInheritorFailed',
        inheritor: args.inheritor as Address,
        value: args.value as bigint,
      };
    case 'ValueClaimFailed':
      return {
        ...meta,
        type: 'ValueClaimFailed',
        claimedId: args.claimedId as Hex,
        value: args.value as bigint,
      };
    case 'ValueClaimed':
      return {
        ...meta,
        type: 'ValueClaimed',
        claimedId: args.claimedId as Hex,
        value: args.value as bigint,
      };
    case 'ValueClaimingRequested':
      return {
        ...meta,
        type: 'ValueClaimingRequested',
        claimedId: args.claimedId as Hex,
        source: args.source as Address,
      };
    default:
      return null;
  }
}

/**
 * Subscribes to all events emitted by a Mirror contract and dispatches them
 * through a typed discriminated union.
 *
 * Wraps viem's `publicClient.watchContractEvent` — re-connection and polling
 * fallback are handled by viem internally.
 *
 * @param publicClient - viem PublicClient (typically `ethClient.publicClient`)
 * @param mirror - the Mirror contract address (per-program proxy)
 * @param handlers - {@link StreamHandlers}
 * @param options - {@link WatchProgramEventsOptions}
 * @returns {@link Unsubscribe} call this to stop the stream
 */
export function watchProgramEvents(
  publicClient: PublicClient,
  mirror: Address,
  handlers: StreamHandlers<ProgramEvent>,
  options: WatchProgramEventsOptions = {},
): Unsubscribe {
  return publicClient.watchContractEvent({
    address: mirror,
    abi: IMIRROR_ABI,
    fromBlock: options.fromBlock,
    onLogs: (logs) => {
      for (const log of logs) {
        const event = decodeProgramLog(log);
        if (event !== null) handlers.onEvent(event);
      }
    },
    onError: handlers.onError,
  });
}
