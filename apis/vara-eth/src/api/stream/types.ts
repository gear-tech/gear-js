import type { Address, Hex } from 'viem';

/**
 * Callbacks supplied to a `api.stream.*` subscription.
 *
 * - `onEvent` fires for each decoded event log.
 * - `onReconnect` (optional) fires when the underlying WebSocket provider
 *   transitions from `disconnected` → `connected`. It does NOT fire on the
 *   initial connection. Best-effort signal: viem's `watchContractEvent` manages
 *   its own polling/subscription internally, so this hook reflects provider
 *   health and may not exactly match viem's stream health.
 * - `onError` (optional) surfaces transport or decode errors. If omitted, errors
 *   are silently swallowed by viem.
 */
export interface StreamHandlers<TEvent> {
  onEvent: (event: TEvent) => void;
  onReconnect?: () => void;
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
