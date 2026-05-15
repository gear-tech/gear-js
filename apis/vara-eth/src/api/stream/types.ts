import type { Address, Hex, Log } from 'viem';

/**
 * Callbacks supplied to a `api.stream.*` subscription.
 *
 * - `onEvent` fires for each decoded event log.
 * - `onError` (optional) surfaces transport or decode errors. If omitted, errors
 *   are silently swallowed by viem.
 *
 * Reconnection is handled transparently by viem — no explicit `onReconnect`
 * hook is exposed because viem's `watchContractEvent` manages its own
 * polling/subscription internally and consumers don't need to re-subscribe.
 */
export interface StreamHandlers<TEvent> {
  onEvent: (event: TEvent) => void;
  onError?: (error: Error) => void;
}

/**
 * Unsubscribe function returned by every `api.stream.*` method.
 * Tear down the subscription by calling it.
 */
export type Unsubscribe = () => void;

/**
 * Per-event metadata attached to every emitted stream event.
 */
export interface EventMeta {
  blockNumber: bigint;
  blockHash: Hex;
  txHash: Hex;
  txIndex: number;
  logIndex: number;
}

/**
 * Lift the on-chain metadata fields off a viem log. Returns `null` if any
 * load-bearing field is null (e.g. pending logs that haven't landed in a block
 * yet) — callers should drop those logs rather than emit half-filled events.
 */
export function buildEventMeta(log: Log): EventMeta | null {
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

/** Options accepted by `watchProgramEvents` / `watchRouterEvents`. */
export interface WatchEventsOptions {
  /** Optional block number to start streaming from (back-fills historical logs). */
  fromBlock?: bigint;
}

// -----------------------------------------------------------------------------
// Mirror (program) events
// -----------------------------------------------------------------------------

/**
 * Discriminated union of every event emitted by a Mirror contract.
 * Use the `type` field to narrow.
 *
 * Maps 1:1 to the `event` entries in `IMIRROR_ABI`.
 */
export type ProgramEvent =
  | (EventMeta & { type: 'ExecutableBalanceTopUpRequested'; value: bigint })
  | (EventMeta & { type: 'Message'; id: Hex; destination: Address; payload: Hex; value: bigint })
  | (EventMeta & { type: 'MessageCallFailed'; id: Hex; destination: Address; value: bigint })
  | (EventMeta & {
      type: 'MessageQueueingRequested';
      id: Hex;
      source: Address;
      payload: Hex;
      value: bigint;
      callReply: boolean;
    })
  | (EventMeta & { type: 'OwnedBalanceTopUpRequested'; value: bigint })
  | (EventMeta & { type: 'Reply'; payload: Hex; value: bigint; replyTo: Hex; replyCode: Hex })
  | (EventMeta & { type: 'ReplyCallFailed'; value: bigint; replyTo: Hex; replyCode: Hex })
  | (EventMeta & { type: 'ReplyQueueingRequested'; repliedTo: Hex; source: Address; payload: Hex; value: bigint })
  | (EventMeta & { type: 'ReplyTransferFailed'; destination: Address; value: bigint })
  | (EventMeta & { type: 'StateChanged'; stateHash: Hex })
  | (EventMeta & { type: 'TransferLockedValueToInheritorFailed'; inheritor: Address; value: bigint })
  | (EventMeta & { type: 'ValueClaimFailed'; claimedId: Hex; value: bigint })
  | (EventMeta & { type: 'ValueClaimed'; claimedId: Hex; value: bigint })
  | (EventMeta & { type: 'ValueClaimingRequested'; claimedId: Hex; source: Address });

// -----------------------------------------------------------------------------
// Router events
// -----------------------------------------------------------------------------

/**
 * Discriminated union of every event emitted by the Router contract.
 * Use the `type` field to narrow.
 *
 * Maps 1:1 to the `event` entries in `IROUTER_ABI`.
 */
export type RouterEvent =
  | (EventMeta & { type: 'AnnouncesCommitted'; head: Hex })
  | (EventMeta & { type: 'BatchCommitted'; hash: Hex })
  | (EventMeta & { type: 'CodeGotValidated'; codeId: Hex; valid: boolean })
  | (EventMeta & { type: 'CodeValidationRequested'; codeId: Hex })
  | (EventMeta & { type: 'ComputationSettingsChanged'; threshold: bigint; wvaraPerSecond: bigint })
  | (EventMeta & { type: 'Initialized'; version: bigint })
  | (EventMeta & { type: 'OwnershipTransferred'; previousOwner: Address; newOwner: Address })
  | (EventMeta & { type: 'Paused'; account: Address })
  | (EventMeta & { type: 'ProgramCreated'; actorId: Address; codeId: Hex })
  | (EventMeta & { type: 'StorageSlotChanged'; slot: Hex })
  | (EventMeta & { type: 'Unpaused'; account: Address })
  | (EventMeta & { type: 'Upgraded'; implementation: Address })
  | (EventMeta & { type: 'ValidatorsCommittedForEra'; eraIndex: bigint });

// -----------------------------------------------------------------------------
// Block headers
// -----------------------------------------------------------------------------

/**
 * Slim block header emitted by `api.stream.blocks`. Only the fields a wallet
 * CLI typically cares about — fork into `publicClient.getBlock` if you need
 * the full body.
 */
export interface StreamedBlockHeader {
  number: bigint;
  hash: Hex;
  parentHash: Hex;
  timestamp: bigint;
  baseFeePerGas: bigint | null;
}
