import '@polkadot/types/lookup';

import type { AccountId32, H160, H256, MultiAddress, Percent } from '@polkadot/types/interfaces/runtime';
import type {
  bool,
  BTreeMap,
  BTreeSet,
  Bytes,
  Compact,
  Enum,
  Option,
  Struct,
  u128,
  u16,
  U256,
  u32,
  u64,
  U8aFixed,
  Vec,
} from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import { SpWeightsWeightV2Weight } from '@polkadot/types/lookup';
import { Null } from '@polkadot/types';

/** @name FrameSystemAccountInfo (3) */
export interface PalletGearCall extends Enum {
  readonly isUploadCode: boolean;
  readonly asUploadCode: {
    readonly code: Bytes;
  } & Struct;
  readonly isUploadProgram: boolean;
  readonly asUploadProgram: {
    readonly code: Bytes;
    readonly salt: Bytes;
    readonly initPayload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isCreateProgram: boolean;
  readonly asCreateProgram: {
    readonly codeId: GprimitivesCodeId;
    readonly salt: Bytes;
    readonly initPayload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isSendMessage: boolean;
  readonly asSendMessage: {
    readonly destination: GprimitivesActorId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isSendReply: boolean;
  readonly asSendReply: {
    readonly replyToId: GprimitivesMessageId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isClaimValue: boolean;
  readonly asClaimValue: {
    readonly messageId: GprimitivesMessageId;
  } & Struct;
  readonly isRun: boolean;
  readonly asRun: {
    readonly maxGas: Option<u64>;
  } & Struct;
  readonly isSetExecuteInherent: boolean;
  readonly asSetExecuteInherent: {
    readonly value: bool;
  } & Struct;
  readonly isClaimValueToInheritor: boolean;
  readonly asClaimValueToInheritor: {
    readonly programId: GprimitivesActorId;
    readonly depth: u32;
  } & Struct;
  readonly type:
    | 'UploadCode'
    | 'UploadProgram'
    | 'CreateProgram'
    | 'SendMessage'
    | 'SendReply'
    | 'ClaimValue'
    | 'Run'
    | 'SetExecuteInherent'
    | 'ClaimValueToInheritor';
}
export interface GprimitivesCodeId extends U8aFixed {}

export interface GprimitivesActorId extends U8aFixed {}

export interface GprimitivesMessageId extends U8aFixed {}

export interface PalletGearStakingRewardsCall extends Enum {
  readonly isRefill: boolean;
  readonly asRefill: {
    readonly value: u128;
  } & Struct;
  readonly isForceRefill: boolean;
  readonly asForceRefill: {
    readonly from: MultiAddress;
    readonly value: u128;
  } & Struct;
  readonly isWithdraw: boolean;
  readonly asWithdraw: {
    readonly to: MultiAddress;
    readonly value: u128;
  } & Struct;
  readonly isAlignSupply: boolean;
  readonly asAlignSupply: {
    readonly target: u128;
  } & Struct;
  readonly type: 'Refill' | 'ForceRefill' | 'Withdraw' | 'AlignSupply';
}
export interface PalletGearVoucherCall extends Enum {
  readonly isIssue: boolean;
  readonly asIssue: {
    readonly spender: AccountId32;
    readonly balance: u128;
    readonly programs: Option<BTreeSet<GprimitivesActorId>>;
    readonly codeUploading: bool;
    readonly duration: u32;
  } & Struct;
  readonly isCall: boolean;
  readonly asCall: {
    readonly voucherId: PalletGearVoucherInternalVoucherId;
    readonly call: PalletGearVoucherInternalPrepaidCall;
  } & Struct;
  readonly isRevoke: boolean;
  readonly asRevoke: {
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
  } & Struct;
  readonly isUpdate: boolean;
  readonly asUpdate: {
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
    readonly moveOwnership: Option<AccountId32>;
    readonly balanceTopUp: Option<u128>;
    readonly appendPrograms: Option<Option<BTreeSet<GprimitivesActorId>>>;
    readonly codeUploading: Option<bool>;
    readonly prolongDuration: Option<u32>;
  } & Struct;
  readonly isDecline: boolean;
  readonly asDecline: {
    readonly voucherId: PalletGearVoucherInternalVoucherId;
  } & Struct;
  readonly type: 'Issue' | 'Call' | 'Revoke' | 'Update' | 'Decline';
}
export interface PalletGearVoucherInternalVoucherId extends U8aFixed {}

export interface PalletGearVoucherInternalPrepaidCall extends Enum {
  readonly isSendMessage: boolean;
  readonly asSendMessage: {
    readonly destination: GprimitivesActorId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isSendReply: boolean;
  readonly asSendReply: {
    readonly replyToId: GprimitivesMessageId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isUploadCode: boolean;
  readonly asUploadCode: {
    readonly code: Bytes;
  } & Struct;
  readonly isDeclineVoucher: boolean;
  readonly type: 'SendMessage' | 'SendReply' | 'UploadCode' | 'DeclineVoucher';
}
export interface PalletGearEthBridgeCall extends Enum {
  readonly isPause: boolean;
  readonly isUnpause: boolean;
  readonly isSendEthMessage: boolean;
  readonly asSendEthMessage: {
    readonly destination: H160;
    readonly payload: Bytes;
  } & Struct;
  readonly isSetFee: boolean;
  readonly asSetFee: {
    readonly fee: u128;
  } & Struct;
  readonly type: 'Pause' | 'Unpause' | 'SendEthMessage' | 'SetFee';
}
export interface PalletGearDebugCall extends Enum {
  readonly isEnableDebugMode: boolean;
  readonly asEnableDebugMode: {
    readonly debugModeOn: bool;
  } & Struct;
  readonly isExhaustBlockResources: boolean;
  readonly asExhaustBlockResources: {
    readonly fraction: Percent;
  } & Struct;
  readonly type: 'EnableDebugMode' | 'ExhaustBlockResources';
}
export interface PalletGearEvent extends Enum {
  readonly isMessageQueued: boolean;
  readonly asMessageQueued: {
    readonly id: GprimitivesMessageId;
    readonly source: AccountId32;
    readonly destination: GprimitivesActorId;
    readonly entry: GearCommonEventMessageEntry;
  } & Struct;
  readonly isUserMessageSent: boolean;
  readonly asUserMessageSent: {
    readonly message: GearCoreMessageUserUserMessage;
    readonly expiration: Option<u32>;
  } & Struct;
  readonly isUserMessageRead: boolean;
  readonly asUserMessageRead: {
    readonly id: GprimitivesMessageId;
    readonly reason: GearCommonEventReasonUserMessageReadRuntimeReason;
  } & Struct;
  readonly isMessagesDispatched: boolean;
  readonly asMessagesDispatched: {
    readonly total: u32;
    readonly statuses: BTreeMap<GprimitivesMessageId, GearCommonEventDispatchStatus>;
    readonly stateChanges: BTreeSet<GprimitivesActorId>;
  } & Struct;
  readonly isMessageWaited: boolean;
  readonly asMessageWaited: {
    readonly id: GprimitivesMessageId;
    readonly origin: Option<GearCommonGasProviderNodeGasNodeId>;
    readonly reason: GearCommonEventReasonMessageWaitedRuntimeReason;
    readonly expiration: u32;
  } & Struct;
  readonly isMessageWoken: boolean;
  readonly asMessageWoken: {
    readonly id: GprimitivesMessageId;
    readonly reason: GearCommonEventReasonMessageWokenRuntimeReason;
  } & Struct;
  readonly isCodeChanged: boolean;
  readonly asCodeChanged: {
    readonly id: GprimitivesCodeId;
    readonly change: GearCommonEventCodeChangeKind;
  } & Struct;
  readonly isProgramChanged: boolean;
  readonly asProgramChanged: {
    readonly id: GprimitivesActorId;
    readonly change: GearCommonEventProgramChangeKind;
  } & Struct;
  readonly isQueueNotProcessed: boolean;
  readonly type:
    | 'MessageQueued'
    | 'UserMessageSent'
    | 'UserMessageRead'
    | 'MessagesDispatched'
    | 'MessageWaited'
    | 'MessageWoken'
    | 'CodeChanged'
    | 'ProgramChanged'
    | 'QueueNotProcessed';
}
export interface GearCommonEventMessageEntry extends Enum {
  readonly isInit: boolean;
  readonly isHandle: boolean;
  readonly isReply: boolean;
  readonly asReply: GprimitivesMessageId;
  readonly isSignal: boolean;
  readonly type: 'Init' | 'Handle' | 'Reply' | 'Signal';
}
export interface GearCoreMessageUserUserMessage extends Struct {
  readonly id: GprimitivesMessageId;
  readonly source: GprimitivesActorId;
  readonly destination: GprimitivesActorId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
  readonly details: Option<GearCoreMessageCommonReplyDetails>;
}
export type GearCoreMessagePayloadSizeError = Null;
export interface GearCoreMessageCommonReplyDetails extends Struct {
  readonly to: GprimitivesMessageId;
  readonly code: GearCoreErrorsSimpleReplyCode;
}
export interface GearCoreErrorsSimpleReplyCode extends Enum {
  readonly isSuccess: boolean;
  readonly asSuccess: GearCoreErrorsSimpleSuccessReplyReason;
  readonly isError: boolean;
  readonly asError: GearCoreErrorsSimpleErrorReplyReason;
  readonly isUnsupported: boolean;
  readonly type: 'Success' | 'Error' | 'Unsupported';
}
export interface GearCoreErrorsSimpleSuccessReplyReason extends Enum {
  readonly isAuto: boolean;
  readonly isManual: boolean;
  readonly isUnsupported: boolean;
  readonly type: 'Auto' | 'Manual' | 'Unsupported';
}
export interface GearCoreErrorsSimpleErrorReplyReason extends Enum {
  readonly isExecution: boolean;
  readonly asExecution: GearCoreErrorsSimpleSimpleExecutionError;
  readonly isUnavailableActor: boolean;
  readonly asUnavailableActor: GearCoreErrorsSimpleSimpleUnavailableActorError;
  readonly isRemovedFromWaitlist: boolean;
  readonly isUnsupported: boolean;
  readonly type: 'Execution' | 'UnavailableActor' | 'RemovedFromWaitlist' | 'Unsupported';
}
export interface GearCoreErrorsSimpleSimpleExecutionError extends Enum {
  readonly isRanOutOfGas: boolean;
  readonly isMemoryOverflow: boolean;
  readonly isBackendError: boolean;
  readonly isUserspacePanic: boolean;
  readonly isUnreachableInstruction: boolean;
  readonly isStackLimitExceeded: boolean;
  readonly isUnsupported: boolean;
  readonly type:
    | 'RanOutOfGas'
    | 'MemoryOverflow'
    | 'BackendError'
    | 'UserspacePanic'
    | 'UnreachableInstruction'
    | 'StackLimitExceeded'
    | 'Unsupported';
}
export interface GearCoreErrorsSimpleSimpleUnavailableActorError extends Enum {
  readonly isProgramExited: boolean;
  readonly isInitializationFailure: boolean;
  readonly isUninitialized: boolean;
  readonly isProgramNotCreated: boolean;
  readonly isReinstrumentationFailure: boolean;
  readonly isUnsupported: boolean;
  readonly type:
    | 'ProgramExited'
    | 'InitializationFailure'
    | 'Uninitialized'
    | 'ProgramNotCreated'
    | 'ReinstrumentationFailure'
    | 'Unsupported';
}
export interface GearCommonEventReasonUserMessageReadRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventUserMessageReadRuntimeReason;
  readonly isSystem: boolean;
  readonly asSystem: GearCommonEventUserMessageReadSystemReason;
  readonly type: 'Runtime' | 'System';
}
export interface GearCommonEventUserMessageReadRuntimeReason extends Enum {
  readonly isMessageReplied: boolean;
  readonly isMessageClaimed: boolean;
  readonly type: 'MessageReplied' | 'MessageClaimed';
}
export interface GearCommonEventUserMessageReadSystemReason extends Enum {
  readonly isOutOfRent: boolean;
  readonly type: 'OutOfRent';
}
export interface GearCommonEventDispatchStatus extends Enum {
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isNotExecuted: boolean;
  readonly type: 'Success' | 'Failed' | 'NotExecuted';
}
export interface GearCommonGasProviderNodeGasNodeId extends Enum {
  readonly isNode: boolean;
  readonly asNode: GprimitivesMessageId;
  readonly isReservation: boolean;
  readonly asReservation: GprimitivesReservationId;
  readonly type: 'Node' | 'Reservation';
}
export interface GprimitivesReservationId extends U8aFixed {}

export interface GearCommonEventReasonMessageWaitedRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventMessageWaitedRuntimeReason;
  readonly isSystem: boolean;
  readonly type: 'Runtime' | 'System';
}
export interface GearCommonEventMessageWaitedRuntimeReason extends Enum {
  readonly isWaitCalled: boolean;
  readonly isWaitForCalled: boolean;
  readonly isWaitUpToCalled: boolean;
  readonly isWaitUpToCalledFull: boolean;
  readonly type: 'WaitCalled' | 'WaitForCalled' | 'WaitUpToCalled' | 'WaitUpToCalledFull';
}
export type GearCommonEventMessageWaitedSystemReason = Null;
export interface GearCommonEventReasonMessageWokenRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventMessageWokenRuntimeReason;
  readonly isSystem: boolean;
  readonly asSystem: GearCommonEventMessageWokenSystemReason;
  readonly type: 'Runtime' | 'System';
}
export interface GearCommonEventMessageWokenRuntimeReason extends Enum {
  readonly isWakeCalled: boolean;
  readonly type: 'WakeCalled';
}
export interface GearCommonEventMessageWokenSystemReason extends Enum {
  readonly isProgramGotInitialized: boolean;
  readonly isTimeoutHasCome: boolean;
  readonly isOutOfRent: boolean;
  readonly type: 'ProgramGotInitialized' | 'TimeoutHasCome' | 'OutOfRent';
}
export interface GearCommonEventCodeChangeKind extends Enum {
  readonly isActive: boolean;
  readonly asActive: {
    readonly expiration: Option<u32>;
  } & Struct;
  readonly isInactive: boolean;
  readonly isReinstrumented: boolean;
  readonly type: 'Active' | 'Inactive' | 'Reinstrumented';
}
export interface GearCommonEventProgramChangeKind extends Enum {
  readonly isActive: boolean;
  readonly asActive: {
    readonly expiration: u32;
  } & Struct;
  readonly isInactive: boolean;
  readonly isPaused: boolean;
  readonly isTerminated: boolean;
  readonly isExpirationChanged: boolean;
  readonly asExpirationChanged: {
    readonly expiration: u32;
  } & Struct;
  readonly isProgramSet: boolean;
  readonly asProgramSet: {
    readonly expiration: u32;
  } & Struct;
  readonly type: 'Active' | 'Inactive' | 'Paused' | 'Terminated' | 'ExpirationChanged' | 'ProgramSet';
}
export interface PalletGearStakingRewardsEvent extends Enum {
  readonly isDeposited: boolean;
  readonly asDeposited: {
    readonly amount: u128;
  } & Struct;
  readonly isWithdrawn: boolean;
  readonly asWithdrawn: {
    readonly amount: u128;
  } & Struct;
  readonly isBurned: boolean;
  readonly asBurned: {
    readonly amount: u128;
  } & Struct;
  readonly isMinted: boolean;
  readonly asMinted: {
    readonly amount: u128;
  } & Struct;
  readonly type: 'Deposited' | 'Withdrawn' | 'Burned' | 'Minted';
}
export interface PalletGearVoucherEvent extends Enum {
  readonly isVoucherIssued: boolean;
  readonly asVoucherIssued: {
    readonly owner: AccountId32;
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
  } & Struct;
  readonly isVoucherRevoked: boolean;
  readonly asVoucherRevoked: {
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
  } & Struct;
  readonly isVoucherUpdated: boolean;
  readonly asVoucherUpdated: {
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
    readonly newOwner: Option<AccountId32>;
  } & Struct;
  readonly isVoucherDeclined: boolean;
  readonly asVoucherDeclined: {
    readonly spender: AccountId32;
    readonly voucherId: PalletGearVoucherInternalVoucherId;
  } & Struct;
  readonly type: 'VoucherIssued' | 'VoucherRevoked' | 'VoucherUpdated' | 'VoucherDeclined';
}
export interface PalletGearEthBridgeEvent extends Enum {
  readonly isAuthoritySetHashChanged: boolean;
  readonly asAuthoritySetHashChanged: H256;
  readonly isBridgeCleared: boolean;
  readonly isBridgeInitialized: boolean;
  readonly isBridgePaused: boolean;
  readonly isBridgeUnpaused: boolean;
  readonly isMessageQueued: boolean;
  readonly asMessageQueued: {
    readonly message: PalletGearEthBridgeInternalEthMessage;
    readonly hash_: H256;
  } & Struct;
  readonly isQueueMerkleRootChanged: boolean;
  readonly asQueueMerkleRootChanged: H256;
  readonly type:
    | 'AuthoritySetHashChanged'
    | 'BridgeCleared'
    | 'BridgeInitialized'
    | 'BridgePaused'
    | 'BridgeUnpaused'
    | 'MessageQueued'
    | 'QueueMerkleRootChanged';
}
export interface PalletGearEthBridgeInternalEthMessage extends Struct {
  readonly nonce: U256;
  readonly source: H256;
  readonly destination: H160;
  readonly payload: Bytes;
}
export interface PalletGearDebugEvent extends Enum {
  readonly isDebugMode: boolean;
  readonly asDebugMode: bool;
  readonly isDebugDataSnapshot: boolean;
  readonly asDebugDataSnapshot: PalletGearDebugDebugData;
  readonly type: 'DebugMode' | 'DebugDataSnapshot';
}
export interface PalletGearDebugDebugData extends Struct {
  readonly dispatchQueue: Vec<GearCoreMessageStoredStoredDispatch>;
  readonly programs: BTreeSet<PalletGearDebugProgramDetails>;
}
export interface GearCoreMessageStoredStoredDispatch extends Struct {
  readonly kind: GearCoreMessageDispatchKind;
  readonly message: GearCoreMessageStoredStoredMessage;
  readonly context: Option<GearCoreMessageContextContextStore>;
}
export interface GearCoreMessageDispatchKind extends Enum {
  readonly isInit: boolean;
  readonly isHandle: boolean;
  readonly isReply: boolean;
  readonly isSignal: boolean;
  readonly type: 'Init' | 'Handle' | 'Reply' | 'Signal';
}
export interface GearCoreMessageStoredStoredMessage extends Struct {
  readonly id: GprimitivesMessageId;
  readonly source: GprimitivesActorId;
  readonly destination: GprimitivesActorId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
  readonly details: Option<GearCoreMessageCommonMessageDetails>;
}
export interface GearCoreMessageCommonMessageDetails extends Enum {
  readonly isReply: boolean;
  readonly asReply: GearCoreMessageCommonReplyDetails;
  readonly isSignal: boolean;
  readonly asSignal: GearCoreMessageCommonSignalDetails;
  readonly type: 'Reply' | 'Signal';
}
export interface GearCoreMessageCommonSignalDetails extends Struct {
  readonly to: GprimitivesMessageId;
  readonly code: GearCoreErrorsSimpleSignalCode;
}
export interface GearCoreErrorsSimpleSignalCode extends Enum {
  readonly isExecution: boolean;
  readonly asExecution: GearCoreErrorsSimpleSimpleExecutionError;
  readonly isRemovedFromWaitlist: boolean;
  readonly type: 'Execution' | 'RemovedFromWaitlist';
}
export interface GearCoreMessageContextContextStore extends Struct {
  readonly initialized: BTreeSet<GprimitivesActorId>;
  readonly reservationNonce: u64;
  readonly systemReservation: Option<u64>;
  readonly localNonce: u32;
}
export interface PalletGearDebugProgramDetails extends Struct {
  readonly id: GprimitivesActorId;
  readonly state: PalletGearDebugProgramState;
}
export interface PalletGearDebugProgramState extends Enum {
  readonly isActive: boolean;
  readonly asActive: PalletGearDebugProgramInfo;
  readonly isTerminated: boolean;
  readonly type: 'Active' | 'Terminated';
}
export interface PalletGearDebugProgramInfo extends Struct {
  readonly staticPages: u32;
  readonly persistentPages: BTreeMap<u32, Bytes>;
  readonly codeHash: H256;
}
export type GearCoreMemoryIntoPageBufError = Null;
export interface GearCoreCodeInstrumentedInstrumentedCode extends Struct {
  readonly code: Bytes;
  readonly originalCodeLen: u32;
  readonly exports: BTreeSet<GearCoreMessageDispatchKind>;
  readonly staticPages: u32;
  readonly stackEnd: Option<u32>;
  readonly instantiatedSectionSizes: GearCoreCodeInstrumentedInstantiatedSectionSizes;
  readonly version: u32;
}
export interface GearCoreCodeInstrumentedInstantiatedSectionSizes extends Struct {
  readonly codeSection: u32;
  readonly dataSection: u32;
  readonly globalSection: u32;
  readonly tableSection: u32;
  readonly elementSection: u32;
  readonly typeSection: u32;
}
export interface GearCommonCodeMetadata extends Struct {
  readonly author: H256;
  readonly blockNumber: Compact<u32>;
}
export interface NumeratedTreeIntervalsTree extends Struct {
  readonly inner: BTreeMap<u32, u32>;
}
export interface GearCoreProgram extends Enum {
  readonly isActive: boolean;
  readonly asActive: GearCoreProgramActiveProgram;
  readonly isExited: boolean;
  readonly asExited: GprimitivesActorId;
  readonly isTerminated: boolean;
  readonly asTerminated: GprimitivesActorId;
  readonly type: 'Active' | 'Exited' | 'Terminated';
}
export interface GearCoreProgramActiveProgram extends Struct {
  readonly allocationsTreeLen: u32;
  readonly memoryInfix: u32;
  readonly gasReservationMap: BTreeMap<GprimitivesReservationId, GearCoreReservationGasReservationSlot>;
  readonly codeHash: H256;
  readonly codeExports: BTreeSet<GearCoreMessageDispatchKind>;
  readonly staticPages: u32;
  readonly state: GearCoreProgramProgramState;
  readonly expirationBlock: u32;
}
export interface GearCoreReservationGasReservationSlot extends Struct {
  readonly amount: u64;
  readonly start: u32;
  readonly finish: u32;
}
export interface GearCoreProgramProgramState extends Enum {
  readonly isUninitialized: boolean;
  readonly asUninitialized: {
    readonly messageId: GprimitivesMessageId;
  } & Struct;
  readonly isInitialized: boolean;
  readonly type: 'Uninitialized' | 'Initialized';
}
export interface PalletGearProgramError extends Enum {
  readonly isDuplicateItem: boolean;
  readonly isProgramNotFound: boolean;
  readonly isNotActiveProgram: boolean;
  readonly isCannotFindDataForPage: boolean;
  readonly isProgramCodeNotFound: boolean;
  readonly type:
    | 'DuplicateItem'
    | 'ProgramNotFound'
    | 'NotActiveProgram'
    | 'CannotFindDataForPage'
    | 'ProgramCodeNotFound';
}
export interface GearCommonStorageComplicatedDequeueLinkedNode extends Struct {
  readonly next: Option<GprimitivesMessageId>;
  readonly value: GearCoreMessageStoredStoredDispatch;
}
export interface GearCoreMessageUserUserStoredMessage extends Struct {
  readonly id: GprimitivesMessageId;
  readonly source: GprimitivesActorId;
  readonly destination: GprimitivesActorId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
}
export interface GearCommonStoragePrimitivesInterval extends Struct {
  readonly start: u32;
  readonly finish: u32;
}
export interface GearCoreMessageStoredStoredDelayedDispatch extends Struct {
  readonly kind: GearCoreMessageDispatchKind;
  readonly message: GearCoreMessageStoredStoredMessage;
}
export interface PalletGearMessengerError extends Enum {
  readonly isQueueDuplicateKey: boolean;
  readonly isQueueElementNotFound: boolean;
  readonly isQueueHeadShouldBeSet: boolean;
  readonly isQueueHeadShouldNotBeSet: boolean;
  readonly isQueueTailHasNextKey: boolean;
  readonly isQueueTailParentNotFound: boolean;
  readonly isQueueTailShouldBeSet: boolean;
  readonly isQueueTailShouldNotBeSet: boolean;
  readonly isMailboxDuplicateKey: boolean;
  readonly isMailboxElementNotFound: boolean;
  readonly isWaitlistDuplicateKey: boolean;
  readonly isWaitlistElementNotFound: boolean;
  readonly type:
    | 'QueueDuplicateKey'
    | 'QueueElementNotFound'
    | 'QueueHeadShouldBeSet'
    | 'QueueHeadShouldNotBeSet'
    | 'QueueTailHasNextKey'
    | 'QueueTailParentNotFound'
    | 'QueueTailShouldBeSet'
    | 'QueueTailShouldNotBeSet'
    | 'MailboxDuplicateKey'
    | 'MailboxElementNotFound'
    | 'WaitlistDuplicateKey'
    | 'WaitlistElementNotFound';
}
export interface GearCoreTasksScheduledTask extends Enum {
  readonly isPauseProgram: boolean;
  readonly asPauseProgram: GprimitivesActorId;
  readonly isRemoveCode: boolean;
  readonly asRemoveCode: GprimitivesCodeId;
  readonly isRemoveFromMailbox: boolean;
  readonly asRemoveFromMailbox: ITuple<[AccountId32, GprimitivesMessageId]>;
  readonly isRemoveFromWaitlist: boolean;
  readonly asRemoveFromWaitlist: ITuple<[GprimitivesActorId, GprimitivesMessageId]>;
  readonly isRemovePausedProgram: boolean;
  readonly asRemovePausedProgram: GprimitivesActorId;
  readonly isWakeMessage: boolean;
  readonly asWakeMessage: ITuple<[GprimitivesActorId, GprimitivesMessageId]>;
  readonly isSendDispatch: boolean;
  readonly asSendDispatch: GprimitivesMessageId;
  readonly isSendUserMessage: boolean;
  readonly asSendUserMessage: {
    readonly messageId: GprimitivesMessageId;
    readonly toMailbox: bool;
  } & Struct;
  readonly isRemoveGasReservation: boolean;
  readonly asRemoveGasReservation: ITuple<[GprimitivesActorId, GprimitivesReservationId]>;
  readonly isRemoveResumeSession: boolean;
  readonly asRemoveResumeSession: u32;
  readonly type:
    | 'PauseProgram'
    | 'RemoveCode'
    | 'RemoveFromMailbox'
    | 'RemoveFromWaitlist'
    | 'RemovePausedProgram'
    | 'WakeMessage'
    | 'SendDispatch'
    | 'SendUserMessage'
    | 'RemoveGasReservation'
    | 'RemoveResumeSession';
}
export interface PalletGearSchedulerError extends Enum {
  readonly isDuplicateTask: boolean;
  readonly isTaskNotFound: boolean;
  readonly type: 'DuplicateTask' | 'TaskNotFound';
}
export interface GearCommonGasProviderNodeGasNode extends Enum {
  readonly isExternal: boolean;
  readonly asExternal: {
    readonly id: AccountId32;
    readonly multiplier: GearCommonGasMultiplier;
    readonly value: u64;
    readonly lock: GearCommonGasProviderNodeNodeLock;
    readonly systemReserve: u64;
    readonly refs: GearCommonGasProviderNodeChildrenRefs;
    readonly consumed: bool;
    readonly deposit: bool;
  } & Struct;
  readonly isCut: boolean;
  readonly asCut: {
    readonly id: AccountId32;
    readonly multiplier: GearCommonGasMultiplier;
    readonly value: u64;
    readonly lock: GearCommonGasProviderNodeNodeLock;
  } & Struct;
  readonly isReserved: boolean;
  readonly asReserved: {
    readonly id: AccountId32;
    readonly multiplier: GearCommonGasMultiplier;
    readonly value: u64;
    readonly lock: GearCommonGasProviderNodeNodeLock;
    readonly refs: GearCommonGasProviderNodeChildrenRefs;
    readonly consumed: bool;
  } & Struct;
  readonly isSpecifiedLocal: boolean;
  readonly asSpecifiedLocal: {
    readonly parent: GearCommonGasProviderNodeGasNodeId;
    readonly root: GearCommonGasProviderNodeGasNodeId;
    readonly value: u64;
    readonly lock: GearCommonGasProviderNodeNodeLock;
    readonly systemReserve: u64;
    readonly refs: GearCommonGasProviderNodeChildrenRefs;
    readonly consumed: bool;
  } & Struct;
  readonly isUnspecifiedLocal: boolean;
  readonly asUnspecifiedLocal: {
    readonly parent: GearCommonGasProviderNodeGasNodeId;
    readonly root: GearCommonGasProviderNodeGasNodeId;
    readonly lock: GearCommonGasProviderNodeNodeLock;
    readonly systemReserve: u64;
  } & Struct;
  readonly type: 'External' | 'Cut' | 'Reserved' | 'SpecifiedLocal' | 'UnspecifiedLocal';
}
export interface GearCommonGasMultiplier extends Enum {
  readonly isValuePerGas: boolean;
  readonly asValuePerGas: u128;
  readonly isGasPerValue: boolean;
  readonly asGasPerValue: u64;
  readonly type: 'ValuePerGas' | 'GasPerValue';
}
export interface GearCommonGasProviderNodeNodeLock extends Vec<u64> {}

export interface GearCommonGasProviderNodeChildrenRefs extends Struct {
  readonly specRefs: u32;
  readonly unspecRefs: u32;
}
export interface PalletGearGasError extends Enum {
  readonly isForbidden: boolean;
  readonly isNodeAlreadyExists: boolean;
  readonly isInsufficientBalance: boolean;
  readonly isNodeNotFound: boolean;
  readonly isNodeWasConsumed: boolean;
  readonly isParentIsLost: boolean;
  readonly isParentHasNoChildren: boolean;
  readonly isUnexpectedConsumeOutput: boolean;
  readonly isUnexpectedNodeType: boolean;
  readonly isValueIsNotCaught: boolean;
  readonly isValueIsBlocked: boolean;
  readonly isValueIsNotBlocked: boolean;
  readonly isConsumedWithLock: boolean;
  readonly isConsumedWithSystemReservation: boolean;
  readonly isTotalValueIsOverflowed: boolean;
  readonly isTotalValueIsUnderflowed: boolean;
  readonly type:
    | 'Forbidden'
    | 'NodeAlreadyExists'
    | 'InsufficientBalance'
    | 'NodeNotFound'
    | 'NodeWasConsumed'
    | 'ParentIsLost'
    | 'ParentHasNoChildren'
    | 'UnexpectedConsumeOutput'
    | 'UnexpectedNodeType'
    | 'ValueIsNotCaught'
    | 'ValueIsBlocked'
    | 'ValueIsNotBlocked'
    | 'ConsumedWithLock'
    | 'ConsumedWithSystemReservation'
    | 'TotalValueIsOverflowed'
    | 'TotalValueIsUnderflowed';
}
export interface PalletGearSchedule extends Struct {
  readonly limits: PalletGearScheduleLimits;
  readonly instructionWeights: PalletGearScheduleInstructionWeights;
  readonly syscallWeights: PalletGearScheduleSyscallWeights;
  readonly memoryWeights: PalletGearScheduleMemoryWeights;
  readonly rentWeights: PalletGearScheduleRentWeights;
  readonly dbWeights: PalletGearScheduleDbWeights;
  readonly taskWeights: PalletGearScheduleTaskWeights;
  readonly instantiationWeights: PalletGearScheduleInstantiationWeights;
  readonly codeInstrumentationCost: SpWeightsWeightV2Weight;
  readonly codeInstrumentationByteCost: SpWeightsWeightV2Weight;
  readonly loadAllocationsWeight: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleLimits extends Struct {
  readonly stackHeight: Option<u32>;
  readonly globals: u32;
  readonly locals: u32;
  readonly parameters: u32;
  readonly memoryPages: u16;
  readonly tableSize: u32;
  readonly brTableSize: u32;
  readonly subjectLen: u32;
  readonly callDepth: u32;
  readonly payloadLen: u32;
  readonly codeLen: u32;
  readonly dataSegmentsAmount: u32;
}
export interface PalletGearScheduleInstructionWeights extends Struct {
  readonly version: u32;
  readonly i64const: u32;
  readonly i64load: u32;
  readonly i32load: u32;
  readonly i64store: u32;
  readonly i32store: u32;
  readonly select: u32;
  readonly r_if: u32;
  readonly br: u32;
  readonly brIf: u32;
  readonly brTable: u32;
  readonly brTablePerEntry: u32;
  readonly call: u32;
  readonly callIndirect: u32;
  readonly callIndirectPerParam: u32;
  readonly callPerLocal: u32;
  readonly localGet: u32;
  readonly localSet: u32;
  readonly localTee: u32;
  readonly globalGet: u32;
  readonly globalSet: u32;
  readonly memoryCurrent: u32;
  readonly i64clz: u32;
  readonly i32clz: u32;
  readonly i64ctz: u32;
  readonly i32ctz: u32;
  readonly i64popcnt: u32;
  readonly i32popcnt: u32;
  readonly i64eqz: u32;
  readonly i32eqz: u32;
  readonly i32extend8s: u32;
  readonly i32extend16s: u32;
  readonly i64extend8s: u32;
  readonly i64extend16s: u32;
  readonly i64extend32s: u32;
  readonly i64extendsi32: u32;
  readonly i64extendui32: u32;
  readonly i32wrapi64: u32;
  readonly i64eq: u32;
  readonly i32eq: u32;
  readonly i64ne: u32;
  readonly i32ne: u32;
  readonly i64lts: u32;
  readonly i32lts: u32;
  readonly i64ltu: u32;
  readonly i32ltu: u32;
  readonly i64gts: u32;
  readonly i32gts: u32;
  readonly i64gtu: u32;
  readonly i32gtu: u32;
  readonly i64les: u32;
  readonly i32les: u32;
  readonly i64leu: u32;
  readonly i32leu: u32;
  readonly i64ges: u32;
  readonly i32ges: u32;
  readonly i64geu: u32;
  readonly i32geu: u32;
  readonly i64add: u32;
  readonly i32add: u32;
  readonly i64sub: u32;
  readonly i32sub: u32;
  readonly i64mul: u32;
  readonly i32mul: u32;
  readonly i64divs: u32;
  readonly i32divs: u32;
  readonly i64divu: u32;
  readonly i32divu: u32;
  readonly i64rems: u32;
  readonly i32rems: u32;
  readonly i64remu: u32;
  readonly i32remu: u32;
  readonly i64and: u32;
  readonly i32and: u32;
  readonly i64or: u32;
  readonly i32or: u32;
  readonly i64xor: u32;
  readonly i32xor: u32;
  readonly i64shl: u32;
  readonly i32shl: u32;
  readonly i64shrs: u32;
  readonly i32shrs: u32;
  readonly i64shru: u32;
  readonly i32shru: u32;
  readonly i64rotl: u32;
  readonly i32rotl: u32;
  readonly i64rotr: u32;
  readonly i32rotr: u32;
}
export interface PalletGearScheduleSyscallWeights extends Struct {
  readonly alloc: SpWeightsWeightV2Weight;
  readonly free: SpWeightsWeightV2Weight;
  readonly freeRange: SpWeightsWeightV2Weight;
  readonly freeRangePerPage: SpWeightsWeightV2Weight;
  readonly grReserveGas: SpWeightsWeightV2Weight;
  readonly grUnreserveGas: SpWeightsWeightV2Weight;
  readonly grSystemReserveGas: SpWeightsWeightV2Weight;
  readonly grGasAvailable: SpWeightsWeightV2Weight;
  readonly grMessageId: SpWeightsWeightV2Weight;
  readonly grProgramId: SpWeightsWeightV2Weight;
  readonly grSource: SpWeightsWeightV2Weight;
  readonly grValue: SpWeightsWeightV2Weight;
  readonly grValueAvailable: SpWeightsWeightV2Weight;
  readonly grSize: SpWeightsWeightV2Weight;
  readonly grRead: SpWeightsWeightV2Weight;
  readonly grReadPerByte: SpWeightsWeightV2Weight;
  readonly grEnvVars: SpWeightsWeightV2Weight;
  readonly grBlockHeight: SpWeightsWeightV2Weight;
  readonly grBlockTimestamp: SpWeightsWeightV2Weight;
  readonly grRandom: SpWeightsWeightV2Weight;
  readonly grReplyDeposit: SpWeightsWeightV2Weight;
  readonly grSend: SpWeightsWeightV2Weight;
  readonly grSendPerByte: SpWeightsWeightV2Weight;
  readonly grSendWgas: SpWeightsWeightV2Weight;
  readonly grSendWgasPerByte: SpWeightsWeightV2Weight;
  readonly grSendInit: SpWeightsWeightV2Weight;
  readonly grSendPush: SpWeightsWeightV2Weight;
  readonly grSendPushPerByte: SpWeightsWeightV2Weight;
  readonly grSendCommit: SpWeightsWeightV2Weight;
  readonly grSendCommitWgas: SpWeightsWeightV2Weight;
  readonly grReservationSend: SpWeightsWeightV2Weight;
  readonly grReservationSendPerByte: SpWeightsWeightV2Weight;
  readonly grReservationSendCommit: SpWeightsWeightV2Weight;
  readonly grReplyCommit: SpWeightsWeightV2Weight;
  readonly grReplyCommitWgas: SpWeightsWeightV2Weight;
  readonly grReservationReply: SpWeightsWeightV2Weight;
  readonly grReservationReplyPerByte: SpWeightsWeightV2Weight;
  readonly grReservationReplyCommit: SpWeightsWeightV2Weight;
  readonly grReplyPush: SpWeightsWeightV2Weight;
  readonly grReply: SpWeightsWeightV2Weight;
  readonly grReplyPerByte: SpWeightsWeightV2Weight;
  readonly grReplyWgas: SpWeightsWeightV2Weight;
  readonly grReplyWgasPerByte: SpWeightsWeightV2Weight;
  readonly grReplyPushPerByte: SpWeightsWeightV2Weight;
  readonly grReplyTo: SpWeightsWeightV2Weight;
  readonly grSignalCode: SpWeightsWeightV2Weight;
  readonly grSignalFrom: SpWeightsWeightV2Weight;
  readonly grReplyInput: SpWeightsWeightV2Weight;
  readonly grReplyInputWgas: SpWeightsWeightV2Weight;
  readonly grReplyPushInput: SpWeightsWeightV2Weight;
  readonly grReplyPushInputPerByte: SpWeightsWeightV2Weight;
  readonly grSendInput: SpWeightsWeightV2Weight;
  readonly grSendInputWgas: SpWeightsWeightV2Weight;
  readonly grSendPushInput: SpWeightsWeightV2Weight;
  readonly grSendPushInputPerByte: SpWeightsWeightV2Weight;
  readonly grDebug: SpWeightsWeightV2Weight;
  readonly grDebugPerByte: SpWeightsWeightV2Weight;
  readonly grReplyCode: SpWeightsWeightV2Weight;
  readonly grExit: SpWeightsWeightV2Weight;
  readonly grLeave: SpWeightsWeightV2Weight;
  readonly grWait: SpWeightsWeightV2Weight;
  readonly grWaitFor: SpWeightsWeightV2Weight;
  readonly grWaitUpTo: SpWeightsWeightV2Weight;
  readonly grWake: SpWeightsWeightV2Weight;
  readonly grCreateProgram: SpWeightsWeightV2Weight;
  readonly grCreateProgramPayloadPerByte: SpWeightsWeightV2Weight;
  readonly grCreateProgramSaltPerByte: SpWeightsWeightV2Weight;
  readonly grCreateProgramWgas: SpWeightsWeightV2Weight;
  readonly grCreateProgramWgasPayloadPerByte: SpWeightsWeightV2Weight;
  readonly grCreateProgramWgasSaltPerByte: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleMemoryWeights extends Struct {
  readonly lazyPagesSignalRead: SpWeightsWeightV2Weight;
  readonly lazyPagesSignalWrite: SpWeightsWeightV2Weight;
  readonly lazyPagesSignalWriteAfterRead: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncRead: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncWrite: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncWriteAfterRead: SpWeightsWeightV2Weight;
  readonly loadPageData: SpWeightsWeightV2Weight;
  readonly uploadPageData: SpWeightsWeightV2Weight;
  readonly memGrow: SpWeightsWeightV2Weight;
  readonly memGrowPerPage: SpWeightsWeightV2Weight;
  readonly parachainReadHeuristic: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleRentWeights extends Struct {
  readonly waitlist: SpWeightsWeightV2Weight;
  readonly dispatchStash: SpWeightsWeightV2Weight;
  readonly reservation: SpWeightsWeightV2Weight;
  readonly mailbox: SpWeightsWeightV2Weight;
  readonly mailboxThreshold: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleDbWeights extends Struct {
  readonly read: SpWeightsWeightV2Weight;
  readonly readPerByte: SpWeightsWeightV2Weight;
  readonly write: SpWeightsWeightV2Weight;
  readonly writePerByte: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleTaskWeights extends Struct {
  readonly removeGasReservation: SpWeightsWeightV2Weight;
  readonly sendUserMessageToMailbox: SpWeightsWeightV2Weight;
  readonly sendUserMessage: SpWeightsWeightV2Weight;
  readonly sendDispatch: SpWeightsWeightV2Weight;
  readonly wakeMessage: SpWeightsWeightV2Weight;
  readonly wakeMessageNoWake: SpWeightsWeightV2Weight;
  readonly removeFromWaitlist: SpWeightsWeightV2Weight;
  readonly removeFromMailbox: SpWeightsWeightV2Weight;
}
export interface PalletGearScheduleInstantiationWeights extends Struct {
  readonly codeSectionPerByte: SpWeightsWeightV2Weight;
  readonly dataSectionPerByte: SpWeightsWeightV2Weight;
  readonly globalSectionPerByte: SpWeightsWeightV2Weight;
  readonly tableSectionPerByte: SpWeightsWeightV2Weight;
  readonly elementSectionPerByte: SpWeightsWeightV2Weight;
  readonly typeSectionPerByte: SpWeightsWeightV2Weight;
}
export interface PalletGearError extends Enum {
  readonly isMessageNotFound: boolean;
  readonly isInsufficientBalance: boolean;
  readonly isGasLimitTooHigh: boolean;
  readonly isProgramAlreadyExists: boolean;
  readonly isInactiveProgram: boolean;
  readonly isNoMessageTree: boolean;
  readonly isCodeAlreadyExists: boolean;
  readonly isCodeDoesntExist: boolean;
  readonly isCodeTooLarge: boolean;
  readonly isProgramConstructionFailed: boolean;
  readonly isMessageQueueProcessingDisabled: boolean;
  readonly isResumePeriodLessThanMinimal: boolean;
  readonly isProgramNotFound: boolean;
  readonly isGearRunAlreadyInBlock: boolean;
  readonly isProgramRentDisabled: boolean;
  readonly isActiveProgram: boolean;
  readonly type:
    | 'MessageNotFound'
    | 'InsufficientBalance'
    | 'GasLimitTooHigh'
    | 'ProgramAlreadyExists'
    | 'InactiveProgram'
    | 'NoMessageTree'
    | 'CodeAlreadyExists'
    | 'CodeDoesntExist'
    | 'CodeTooLarge'
    | 'ProgramConstructionFailed'
    | 'MessageQueueProcessingDisabled'
    | 'ResumePeriodLessThanMinimal'
    | 'ProgramNotFound'
    | 'GearRunAlreadyInBlock'
    | 'ProgramRentDisabled'
    | 'ActiveProgram';
}
export interface PalletGearStakingRewardsError extends Enum {
  readonly isFailureToRefillPool: boolean;
  readonly isFailureToWithdrawFromPool: boolean;
  readonly type: 'FailureToRefillPool' | 'FailureToWithdrawFromPool';
}
export interface PalletGearVoucherInternalVoucherInfo extends Struct {
  readonly owner: AccountId32;
  readonly programs: Option<BTreeSet<GprimitivesActorId>>;
  readonly codeUploading: bool;
  readonly expiry: u32;
}
export interface PalletGearVoucherError extends Enum {
  readonly isBadOrigin: boolean;
  readonly isBalanceTransfer: boolean;
  readonly isInappropriateDestination: boolean;
  readonly isInexistentVoucher: boolean;
  readonly isIrrevocableYet: boolean;
  readonly isMaxProgramsLimitExceeded: boolean;
  readonly isUnknownDestination: boolean;
  readonly isVoucherExpired: boolean;
  readonly isDurationOutOfBounds: boolean;
  readonly isCodeUploadingEnabled: boolean;
  readonly isCodeUploadingDisabled: boolean;
  readonly type:
    | 'BadOrigin'
    | 'BalanceTransfer'
    | 'InappropriateDestination'
    | 'InexistentVoucher'
    | 'IrrevocableYet'
    | 'MaxProgramsLimitExceeded'
    | 'UnknownDestination'
    | 'VoucherExpired'
    | 'DurationOutOfBounds'
    | 'CodeUploadingEnabled'
    | 'CodeUploadingDisabled';
}
export interface PalletGearBankBankAccount extends Struct {
  readonly gas: u128;
  readonly value: u128;
}
export interface PalletGearBankError extends Enum {
  readonly isInsufficientBalance: boolean;
  readonly isInsufficientGasBalance: boolean;
  readonly isInsufficientValueBalance: boolean;
  readonly isInsufficientBankBalance: boolean;
  readonly isInsufficientDeposit: boolean;
  readonly isOverflow: boolean;
  readonly type:
    | 'InsufficientBalance'
    | 'InsufficientGasBalance'
    | 'InsufficientValueBalance'
    | 'InsufficientBankBalance'
    | 'InsufficientDeposit'
    | 'Overflow';
}
export interface PalletGearEthBridgeError extends Enum {
  readonly isBridgeIsNotYetInitialized: boolean;
  readonly isBridgeIsPaused: boolean;
  readonly isMaxPayloadSizeExceeded: boolean;
  readonly isQueueCapacityExceeded: boolean;
  readonly isIncorrectValueApplied: boolean;
  readonly type:
    | 'BridgeIsNotYetInitialized'
    | 'BridgeIsPaused'
    | 'MaxPayloadSizeExceeded'
    | 'QueueCapacityExceeded'
    | 'IncorrectValueApplied';
}
