export interface BlockHeader {
  readonly hash: string;
  readonly height: number;
  readonly timestamp: number;
  readonly parentHash: string;
}

export interface CodeValidationRequestedEvent {
  readonly codeId: string;
  readonly timestamp: number;
  readonly txHash: string;
}

export interface ComputationSettingsChangedEvent {
  readonly threshold: bigint;
  readonly wvaraPerSecond: bigint;
}

export interface ProgramCreatedEvent {
  readonly actorId: string;
  readonly codeId: string;
}

export interface StorageSlotChangedEvent {
  readonly slot: string;
}

export interface ValidatorsCommittedForEraEvent {
  readonly eraIndex: bigint;
}

export type RouterRequestEvent =
  | { readonly CodeValidationRequested: CodeValidationRequestedEvent }
  | { readonly ComputationSettingsChanged: ComputationSettingsChangedEvent }
  | { readonly ProgramCreated: ProgramCreatedEvent }
  | { readonly StorageSlotChanged: StorageSlotChangedEvent }
  | { readonly ValidatorsCommittedForEra: ValidatorsCommittedForEraEvent };

export interface OwnedBalanceTopUpRequestedEvent {
  readonly value: bigint;
}

export interface ExecutableBalanceTopUpRequestedEvent {
  readonly value: bigint;
}

export interface MessageQueueingRequestedEvent {
  readonly id: string;
  readonly source: string;
  readonly payload: number[];
  readonly value: bigint;
  readonly callReply: boolean;
}

export interface ReplyQueueingRequestedEvent {
  readonly repliedTo: string;
  readonly source: string;
  readonly payload: number[];
  readonly value: bigint;
}

export interface ValueClaimingRequestedEvent {
  readonly claimedId: string;
  readonly source: string;
}

export type MirrorRequestEvent =
  | { readonly OwnedBalanceTopUpRequested: OwnedBalanceTopUpRequestedEvent }
  | { readonly ExecutableBalanceTopUpRequested: ExecutableBalanceTopUpRequestedEvent }
  | { readonly MessageQueueingRequested: MessageQueueingRequestedEvent }
  | { readonly ReplyQueueingRequested: ReplyQueueingRequestedEvent }
  | { readonly ValueClaimingRequested: ValueClaimingRequestedEvent };

export type BlockRequestEvent =
  | { readonly Router: RouterRequestEvent }
  | { readonly Mirror: { readonly actorId: string; readonly event: MirrorRequestEvent } };

export interface ValueClaim {
  readonly messageId: string;
  readonly destination: string;
  readonly value: bigint;
}

export interface OutgoingMessage {
  readonly id: string;
  readonly destination: string;
  readonly payload: number[];
  readonly value: bigint;
  readonly replyDetails: unknown | null;
  readonly call: boolean;
}

export interface StateTransition {
  readonly actorId: string;
  readonly newStateHash: string;
  readonly exited: boolean;
  readonly inheritor: string;
  readonly valueToReceive: bigint;
  readonly valueToReceiveNegativeSign: boolean;
  readonly valueClaims: ValueClaim[];
  readonly messages: OutgoingMessage[];
}
