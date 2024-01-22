import '@polkadot/types/lookup';

import type { AccountId32, H256, MultiAddress } from '@polkadot/types/interfaces/runtime';
import type {
  BTreeMap,
  BTreeSet,
  Bytes,
  Compact,
  Enum,
  Null,
  Option,
  Struct,
  U8aFixed,
  Vec,
  bool,
  u128,
  u16,
  u32,
  u64,
} from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import { SpWeightsWeightV2Weight } from '@polkadot/types/lookup';

/** @name PalletGearCall (265) */
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
  } & Struct;
  readonly isCreateProgram: boolean;
  readonly asCreateProgram: {
    readonly codeId: GearCoreIdsCodeId;
    readonly salt: Bytes;
    readonly initPayload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
  } & Struct;
  readonly isSendMessage: boolean;
  readonly asSendMessage: {
    readonly destination: GearCoreIdsProgramId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly prepaid: bool;
  } & Struct;
  readonly isSendReply: boolean;
  readonly asSendReply: {
    readonly replyToId: GearCoreIdsMessageId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly prepaid: bool;
  } & Struct;
  readonly isClaimValue: boolean;
  readonly asClaimValue: {
    readonly messageId: GearCoreIdsMessageId;
  } & Struct;
  readonly isRun: boolean;
  readonly asRun: {
    readonly maxGas: Option<u64>;
  } & Struct;
  readonly isSetExecuteInherent: boolean;
  readonly asSetExecuteInherent: {
    readonly value: bool;
  } & Struct;
  readonly isPayProgramRent: boolean;
  readonly asPayProgramRent: {
    readonly programId: GearCoreIdsProgramId;
    readonly blockCount: u32;
  } & Struct;
  readonly isResumeSessionInit: boolean;
  readonly asResumeSessionInit: {
    readonly programId: GearCoreIdsProgramId;
    readonly allocations: BTreeSet<u32>;
    readonly codeHash: GearCoreIdsCodeId;
  } & Struct;
  readonly isResumeSessionPush: boolean;
  readonly asResumeSessionPush: {
    readonly sessionId: u32;
    readonly memoryPages: Vec<ITuple<[u32, Bytes]>>;
  } & Struct;
  readonly isResumeSessionCommit: boolean;
  readonly asResumeSessionCommit: {
    readonly sessionId: u32;
    readonly blockCount: u32;
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
    | 'PayProgramRent'
    | 'ResumeSessionInit'
    | 'ResumeSessionPush'
    | 'ResumeSessionCommit';
}

/** @name GearCoreIdsCodeId (266) */
export type GearCoreIdsCodeId = U8aFixed;

/** @name GearCoreIdsProgramId (267) */
export type GearCoreIdsProgramId = U8aFixed;

/** @name GearCoreIdsMessageId (268) */
export type GearCoreIdsMessageId = U8aFixed;

/** @name PalletGearStakingRewardsCall (278) */
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
  readonly type: 'Refill' | 'ForceRefill' | 'Withdraw';
}

/** @name PalletGearDebugCall (281) */
export interface PalletGearDebugCall extends Enum {
  readonly isEnableDebugMode: boolean;
  readonly asEnableDebugMode: {
    readonly debugModeOn: bool;
  } & Struct;
  readonly type: 'EnableDebugMode';
}

/** @name PalletGearEvent (308) */
export interface PalletGearEvent extends Enum {
  readonly isMessageQueued: boolean;
  readonly asMessageQueued: {
    readonly id: GearCoreIdsMessageId;
    readonly source: AccountId32;
    readonly destination: GearCoreIdsProgramId;
    readonly entry: GearCommonEventMessageEntry;
  } & Struct;
  readonly isUserMessageSent: boolean;
  readonly asUserMessageSent: {
    readonly message: GearCoreMessageUserUserMessage;
    readonly expiration: Option<u32>;
  } & Struct;
  readonly isUserMessageRead: boolean;
  readonly asUserMessageRead: {
    readonly id: GearCoreIdsMessageId;
    readonly reason: GearCommonEventReasonUserMessageReadRuntimeReason;
  } & Struct;
  readonly isMessagesDispatched: boolean;
  readonly asMessagesDispatched: {
    readonly total: u32;
    readonly statuses: BTreeMap<GearCoreIdsMessageId, GearCommonEventDispatchStatus>;
    readonly stateChanges: BTreeSet<GearCoreIdsProgramId>;
  } & Struct;
  readonly isMessageWaited: boolean;
  readonly asMessageWaited: {
    readonly id: GearCoreIdsMessageId;
    readonly origin: Option<GearCommonGasProviderNodeGasNodeId>;
    readonly reason: GearCommonEventReasonMessageWaitedRuntimeReason;
    readonly expiration: u32;
  } & Struct;
  readonly isMessageWoken: boolean;
  readonly asMessageWoken: {
    readonly id: GearCoreIdsMessageId;
    readonly reason: GearCommonEventReasonMessageWokenRuntimeReason;
  } & Struct;
  readonly isCodeChanged: boolean;
  readonly asCodeChanged: {
    readonly id: GearCoreIdsCodeId;
    readonly change: GearCommonEventCodeChangeKind;
  } & Struct;
  readonly isProgramChanged: boolean;
  readonly asProgramChanged: {
    readonly id: GearCoreIdsProgramId;
    readonly change: GearCommonEventProgramChangeKind;
  } & Struct;
  readonly isQueueNotProcessed: boolean;
  readonly isProgramResumeSessionStarted: boolean;
  readonly asProgramResumeSessionStarted: {
    readonly sessionId: u32;
    readonly accountId: AccountId32;
    readonly programId: GearCoreIdsProgramId;
    readonly sessionEndBlock: u32;
  } & Struct;
  readonly type:
    | 'MessageQueued'
    | 'UserMessageSent'
    | 'UserMessageRead'
    | 'MessagesDispatched'
    | 'MessageWaited'
    | 'MessageWoken'
    | 'CodeChanged'
    | 'ProgramChanged'
    | 'QueueNotProcessed'
    | 'ProgramResumeSessionStarted';
}

/** @name GearCommonEventMessageEntry (309) */
export interface GearCommonEventMessageEntry extends Enum {
  readonly isInit: boolean;
  readonly isHandle: boolean;
  readonly isReply: boolean;
  readonly asReply: GearCoreIdsMessageId;
  readonly isSignal: boolean;
  readonly type: 'Init' | 'Handle' | 'Reply' | 'Signal';
}

/** @name GearCoreMessageUserUserMessage (310) */
export interface GearCoreMessageUserUserMessage extends Struct {
  readonly id: GearCoreIdsMessageId;
  readonly source: GearCoreIdsProgramId;
  readonly destination: GearCoreIdsProgramId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
  readonly details: Option<GearCoreMessageCommonReplyDetails>;
}

/** @name GearCoreMessagePayloadSizeError (312) */
export type GearCoreMessagePayloadSizeError = Null;

/** @name GearCoreMessageCommonReplyDetails (314) */
export interface GearCoreMessageCommonReplyDetails extends Struct {
  readonly to: GearCoreIdsMessageId;
  readonly code: GearCoreErrorsSimpleReplyCode;
}

/** @name GearCoreErrorsSimpleReplyCode (315) */
export interface GearCoreErrorsSimpleReplyCode extends Enum {
  readonly isSuccess: boolean;
  readonly asSuccess: GearCoreErrorsSimpleSuccessReplyReason;
  readonly isError: boolean;
  readonly asError: GearCoreErrorsSimpleErrorReplyReason;
  readonly isUnsupported: boolean;
  readonly type: 'Success' | 'Error' | 'Unsupported';
}

/** @name GearCoreErrorsSimpleSuccessReplyReason (316) */
export interface GearCoreErrorsSimpleSuccessReplyReason extends Enum {
  readonly isAuto: boolean;
  readonly isManual: boolean;
  readonly isUnsupported: boolean;
  readonly type: 'Auto' | 'Manual' | 'Unsupported';
}

/** @name GearCoreErrorsSimpleErrorReplyReason (317) */
export interface GearCoreErrorsSimpleErrorReplyReason extends Enum {
  readonly isExecution: boolean;
  readonly asExecution: GearCoreErrorsSimpleSimpleExecutionError;
  readonly isFailedToCreateProgram: boolean;
  readonly asFailedToCreateProgram: GearCoreErrorsSimpleSimpleProgramCreationError;
  readonly isInactiveProgram: boolean;
  readonly isRemovedFromWaitlist: boolean;
  readonly isUnsupported: boolean;
  readonly type: 'Execution' | 'FailedToCreateProgram' | 'InactiveProgram' | 'RemovedFromWaitlist' | 'Unsupported';
}

/** @name GearCoreErrorsSimpleSimpleExecutionError (318) */
export interface GearCoreErrorsSimpleSimpleExecutionError extends Enum {
  readonly isRanOutOfGas: boolean;
  readonly isMemoryOverflow: boolean;
  readonly isBackendError: boolean;
  readonly isUserspacePanic: boolean;
  readonly isUnreachableInstruction: boolean;
  readonly isUnsupported: boolean;
  readonly type:
    | 'RanOutOfGas'
    | 'MemoryOverflow'
    | 'BackendError'
    | 'UserspacePanic'
    | 'UnreachableInstruction'
    | 'Unsupported';
}

/** @name GearCoreErrorsSimpleSimpleProgramCreationError (319) */
export interface GearCoreErrorsSimpleSimpleProgramCreationError extends Enum {
  readonly isCodeNotExists: boolean;
  readonly isUnsupported: boolean;
  readonly type: 'CodeNotExists' | 'Unsupported';
}

/** @name GearCommonEventReasonUserMessageReadRuntimeReason (320) */
export interface GearCommonEventReasonUserMessageReadRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventUserMessageReadRuntimeReason;
  readonly isSystem: boolean;
  readonly asSystem: GearCommonEventUserMessageReadSystemReason;
  readonly type: 'Runtime' | 'System';
}

/** @name GearCommonEventUserMessageReadRuntimeReason (321) */
export interface GearCommonEventUserMessageReadRuntimeReason extends Enum {
  readonly isMessageReplied: boolean;
  readonly isMessageClaimed: boolean;
  readonly type: 'MessageReplied' | 'MessageClaimed';
}

/** @name GearCommonEventUserMessageReadSystemReason (322) */
export interface GearCommonEventUserMessageReadSystemReason extends Enum {
  readonly isOutOfRent: boolean;
  readonly type: 'OutOfRent';
}

/** @name GearCoreCodeInstrumentedCode (217) */
export interface GearCoreCodeInstrumentedCode extends Struct {
  readonly code: Bytes;
  readonly originalCodeLen: u32;
  readonly exports: BTreeSet<GearCoreMessageDispatchKind>;
  readonly staticPages: u32;
  readonly version: u32;
}

/** @name GearCommonEventDispatchStatus (324) */
export interface GearCommonEventDispatchStatus extends Enum {
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isNotExecuted: boolean;
  readonly type: 'Success' | 'Failed' | 'NotExecuted';
}

/** @name GearCommonGasProviderNodeGasNodeId (330) */
export interface GearCommonGasProviderNodeGasNodeId extends Enum {
  readonly isNode: boolean;
  readonly asNode: GearCoreIdsMessageId;
  readonly isReservation: boolean;
  readonly asReservation: GearCoreIdsReservationId;
  readonly type: 'Node' | 'Reservation';
}

/** @name GearCoreIdsReservationId (331) */
export type GearCoreIdsReservationId = U8aFixed;

/** @name GearCommonEventReasonMessageWaitedRuntimeReason (332) */
export interface GearCommonEventReasonMessageWaitedRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventMessageWaitedRuntimeReason;
  readonly isSystem: boolean;
  readonly asSystem: GearCommonEventMessageWaitedSystemReason;
  readonly type: 'Runtime' | 'System';
}

/** @name GearCommonEventMessageWaitedRuntimeReason (333) */
export interface GearCommonEventMessageWaitedRuntimeReason extends Enum {
  readonly isWaitCalled: boolean;
  readonly isWaitForCalled: boolean;
  readonly isWaitUpToCalled: boolean;
  readonly isWaitUpToCalledFull: boolean;
  readonly type: 'WaitCalled' | 'WaitForCalled' | 'WaitUpToCalled' | 'WaitUpToCalledFull';
}

/** @name GearCommonEventMessageWaitedSystemReason (334) */
export interface GearCommonEventMessageWaitedSystemReason extends Enum {
  readonly isProgramIsNotInitialized: boolean;
  readonly type: 'ProgramIsNotInitialized';
}

/** @name GearCommonEventReasonMessageWokenRuntimeReason (335) */
export interface GearCommonEventReasonMessageWokenRuntimeReason extends Enum {
  readonly isRuntime: boolean;
  readonly asRuntime: GearCommonEventMessageWokenRuntimeReason;
  readonly isSystem: boolean;
  readonly asSystem: GearCommonEventMessageWokenSystemReason;
  readonly type: 'Runtime' | 'System';
}

/** @name GearCommonEventMessageWokenRuntimeReason (336) */
export interface GearCommonEventMessageWokenRuntimeReason extends Enum {
  readonly isWakeCalled: boolean;
  readonly type: 'WakeCalled';
}

/** @name GearCommonEventMessageWokenSystemReason (337) */
export interface GearCommonEventMessageWokenSystemReason extends Enum {
  readonly isProgramGotInitialized: boolean;
  readonly isTimeoutHasCome: boolean;
  readonly isOutOfRent: boolean;
  readonly type: 'ProgramGotInitialized' | 'TimeoutHasCome' | 'OutOfRent';
}

/** @name GearCommonEventCodeChangeKind (338) */
export interface GearCommonEventCodeChangeKind extends Enum {
  readonly isActive: boolean;
  readonly asActive: {
    readonly expiration: Option<u32>;
  } & Struct;
  readonly isInactive: boolean;
  readonly isReinstrumented: boolean;
  readonly type: 'Active' | 'Inactive' | 'Reinstrumented';
}

/** @name GearCommonEventProgramChangeKind (339) */
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

/** @name PalletGearStakingRewardsEvent (340) */
export interface PalletGearStakingRewardsEvent extends Enum {
  readonly isRefilled: boolean;
  readonly asRefilled: {
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
  readonly type: 'Refilled' | 'Withdrawn' | 'Burned';
}

/** @name PalletGearDebugEvent (343) */
export interface PalletGearDebugEvent extends Enum {
  readonly isDebugMode: boolean;
  readonly asDebugMode: bool;
  readonly isDebugDataSnapshot: boolean;
  readonly asDebugDataSnapshot: PalletGearDebugDebugData;
  readonly type: 'DebugMode' | 'DebugDataSnapshot';
}

/** @name PalletGearDebugDebugData (344) */
export interface PalletGearDebugDebugData extends Struct {
  readonly dispatchQueue: Vec<GearCoreMessageStoredStoredDispatch>;
  readonly programs: Vec<PalletGearDebugProgramDetails>;
}

/** @name GearCoreMessageStoredStoredDispatch (346) */
export interface GearCoreMessageStoredStoredDispatch extends Struct {
  readonly kind: GearCoreMessageDispatchKind;
  readonly message: GearCoreMessageStoredStoredMessage;
  readonly context: Option<GearCoreMessageContextContextStore>;
}

/** @name GearCoreMessageDispatchKind (347) */
export interface GearCoreMessageDispatchKind extends Enum {
  readonly isInit: boolean;
  readonly isHandle: boolean;
  readonly isReply: boolean;
  readonly isSignal: boolean;
  readonly type: 'Init' | 'Handle' | 'Reply' | 'Signal';
}

/** @name GearCoreMessageStoredStoredMessage (348) */
export interface GearCoreMessageStoredStoredMessage extends Struct {
  readonly id: GearCoreIdsMessageId;
  readonly source: GearCoreIdsProgramId;
  readonly destination: GearCoreIdsProgramId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
  readonly details: Option<GearCoreMessageCommonMessageDetails>;
}

/** @name GearCoreMessageCommonMessageDetails (350) */
export interface GearCoreMessageCommonMessageDetails extends Enum {
  readonly isReply: boolean;
  readonly asReply: GearCoreMessageCommonReplyDetails;
  readonly isSignal: boolean;
  readonly asSignal: GearCoreMessageCommonSignalDetails;
  readonly type: 'Reply' | 'Signal';
}

/** @name GearCoreMessageCommonSignalDetails (351) */
export interface GearCoreMessageCommonSignalDetails extends Struct {
  readonly to: GearCoreIdsMessageId;
  readonly code: GearCoreErrorsSimpleSignalCode;
}

/** @name GearCoreErrorsSimpleSignalCode (352) */
export interface GearCoreErrorsSimpleSignalCode extends Enum {
  readonly isExecution: boolean;
  readonly asExecution: GearCoreErrorsSimpleSimpleExecutionError;
  readonly isRemovedFromWaitlist: boolean;
  readonly type: 'Execution' | 'RemovedFromWaitlist';
}

/** @name GearCoreMessageContextContextStore (354) */
export interface GearCoreMessageContextContextStore extends Struct {
  readonly outgoing: BTreeMap<u32, Option<Bytes>>;
  readonly reply: Option<Bytes>;
  readonly initialized: BTreeSet<GearCoreIdsProgramId>;
  readonly awaken: BTreeSet<GearCoreIdsMessageId>;
  readonly replySent: bool;
  readonly reservationNonce: u64;
  readonly systemReservation: Option<u64>;
}

/** @name PalletGearDebugProgramDetails (363) */
export interface PalletGearDebugProgramDetails extends Struct {
  readonly id: GearCoreIdsProgramId;
  readonly state: PalletGearDebugProgramState;
}

/** @name PalletGearDebugProgramState (364) */
export interface PalletGearDebugProgramState extends Enum {
  readonly isActive: boolean;
  readonly asActive: PalletGearDebugProgramInfo;
  readonly isTerminated: boolean;
  readonly type: 'Active' | 'Terminated';
}

/** @name PalletGearDebugProgramInfo (365) */
export interface PalletGearDebugProgramInfo extends Struct {
  readonly staticPages: u32;
  readonly persistentPages: BTreeMap<u32, Bytes>;
  readonly codeHash: H256;
}

/** @name GearCoreCodeInstrumentedCode (576) */
export interface GearCoreCodeInstrumentedCode extends Struct {
  readonly code: Bytes;
  readonly originalCodeLen: u32;
  readonly exports: BTreeSet<GearCoreMessageDispatchKind>;
  readonly staticPages: u32;
  readonly version: u32;
}

/** @name GearCommonCodeMetadata (579) */
export interface GearCommonCodeMetadata extends Struct {
  readonly author: H256;
  readonly blockNumber: Compact<u32>;
}

/** @name GearCommonProgram (580) */
export interface GearCommonProgram extends Enum {
  readonly isActive: boolean;
  readonly asActive: GearCommonActiveProgram;
  readonly isExited: boolean;
  readonly asExited: GearCoreIdsProgramId;
  readonly isTerminated: boolean;
  readonly asTerminated: GearCoreIdsProgramId;
  readonly type: 'Active' | 'Exited' | 'Terminated';
}

/** @name GearCommonActiveProgram (581) */
export interface GearCommonActiveProgram extends Struct {
  readonly allocations: BTreeSet<u32>;
  readonly pagesWithData: BTreeSet<u32>;
  readonly memoryInfix: u32;
  readonly gasReservationMap: BTreeMap<GearCoreIdsReservationId, GearCoreReservationGasReservationSlot>;
  readonly codeHash: H256;
  readonly codeExports: BTreeSet<GearCoreMessageDispatchKind>;
  readonly staticPages: u32;
  readonly state: GearCommonProgramState;
  readonly expirationBlock: u32;
}

/** @name GearCoreReservationGasReservationSlot (586) */
export interface GearCoreReservationGasReservationSlot extends Struct {
  readonly amount: u64;
  readonly start: u32;
  readonly finish: u32;
}

/** @name GearCommonProgramState (589) */
export interface GearCommonProgramState extends Enum {
  readonly isUninitialized: boolean;
  readonly asUninitialized: {
    readonly messageId: GearCoreIdsMessageId;
  } & Struct;
  readonly isInitialized: boolean;
  readonly type: 'Uninitialized' | 'Initialized';
}

/** @name GearCommonPausedProgramStorageResumeSession (592) */
export interface GearCommonPausedProgramStorageResumeSession extends Struct {
  readonly pageCount: u32;
  readonly user: AccountId32;
  readonly programId: GearCoreIdsProgramId;
  readonly allocations: BTreeSet<u32>;
  readonly pagesWithData: BTreeSet<u32>;
  readonly codeHash: GearCoreIdsCodeId;
  readonly endBlock: u32;
}

/** @name PalletGearProgramError (593) */
export interface PalletGearProgramError extends Enum {
  readonly isDuplicateItem: boolean;
  readonly isProgramNotFound: boolean;
  readonly isNotActiveProgram: boolean;
  readonly isCannotFindDataForPage: boolean;
  readonly isResumeSessionNotFound: boolean;
  readonly isNotSessionOwner: boolean;
  readonly isResumeSessionFailed: boolean;
  readonly isProgramCodeNotFound: boolean;
  readonly isDuplicateResumeSession: boolean;
  readonly type:
    | 'DuplicateItem'
    | 'ProgramNotFound'
    | 'NotActiveProgram'
    | 'CannotFindDataForPage'
    | 'ResumeSessionNotFound'
    | 'NotSessionOwner'
    | 'ResumeSessionFailed'
    | 'ProgramCodeNotFound'
    | 'DuplicateResumeSession';
}

/** @name GearCommonStorageComplicatedDequeueLinkedNode (594) */
export interface GearCommonStorageComplicatedDequeueLinkedNode extends Struct {
  readonly next: Option<GearCoreIdsMessageId>;
  readonly value: GearCoreMessageStoredStoredDispatch;
}

/** @name GearCoreMessageUserUserStoredMessage (598) */
export interface GearCoreMessageUserUserStoredMessage extends Struct {
  readonly id: GearCoreIdsMessageId;
  readonly source: GearCoreIdsProgramId;
  readonly destination: GearCoreIdsProgramId;
  readonly payload: Bytes;
  readonly value: Compact<u128>;
}

/** @name GearCommonStoragePrimitivesInterval (599) */
export interface GearCommonStoragePrimitivesInterval extends Struct {
  readonly start: u32;
  readonly finish: u32;
}

/** @name PalletGearMessengerError (602) */
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

/** @name GearCommonSchedulerTaskScheduledTask (604) */
export interface GearCommonSchedulerTaskScheduledTask extends Enum {
  readonly isPauseProgram: boolean;
  readonly asPauseProgram: GearCoreIdsProgramId;
  readonly isRemoveCode: boolean;
  readonly asRemoveCode: GearCoreIdsCodeId;
  readonly isRemoveFromMailbox: boolean;
  readonly asRemoveFromMailbox: ITuple<[AccountId32, GearCoreIdsMessageId]>;
  readonly isRemoveFromWaitlist: boolean;
  readonly asRemoveFromWaitlist: ITuple<[GearCoreIdsProgramId, GearCoreIdsMessageId]>;
  readonly isRemovePausedProgram: boolean;
  readonly asRemovePausedProgram: GearCoreIdsProgramId;
  readonly isWakeMessage: boolean;
  readonly asWakeMessage: ITuple<[GearCoreIdsProgramId, GearCoreIdsMessageId]>;
  readonly isSendDispatch: boolean;
  readonly asSendDispatch: GearCoreIdsMessageId;
  readonly isSendUserMessage: boolean;
  readonly asSendUserMessage: {
    readonly messageId: GearCoreIdsMessageId;
    readonly toMailbox: bool;
  } & Struct;
  readonly isRemoveGasReservation: boolean;
  readonly asRemoveGasReservation: ITuple<[GearCoreIdsProgramId, GearCoreIdsReservationId]>;
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

/** @name PalletGearSchedulerError (605) */
export interface PalletGearSchedulerError extends Enum {
  readonly isDuplicateTask: boolean;
  readonly isTaskNotFound: boolean;
  readonly type: 'DuplicateTask' | 'TaskNotFound';
}

/** @name GearCommonGasProviderNodeGasNode (606) */
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

/** @name GearCommonGasMultiplier (607) */
export interface GearCommonGasMultiplier extends Enum {
  readonly isValuePerGas: boolean;
  readonly asValuePerGas: u128;
  readonly isGasPerValue: boolean;
  readonly asGasPerValue: u64;
  readonly type: 'ValuePerGas' | 'GasPerValue';
}

/** @name GearCommonGasProviderNodeNodeLock (608) */
export type GearCommonGasProviderNodeNodeLock = Vec<u64>;

/** @name GearCommonGasProviderNodeChildrenRefs (610) */
export interface GearCommonGasProviderNodeChildrenRefs extends Struct {
  readonly specRefs: u32;
  readonly unspecRefs: u32;
}

/** @name PalletGearGasError (611) */
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

/** @name PalletGearSchedule (612) */
export interface PalletGearSchedule extends Struct {
  readonly limits: PalletGearScheduleLimits;
  readonly instructionWeights: PalletGearScheduleInstructionWeights;
  readonly hostFnWeights: PalletGearScheduleHostFnWeights;
  readonly memoryWeights: PalletGearScheduleMemoryWeights;
  readonly moduleInstantiationPerByte: SpWeightsWeightV2Weight;
  readonly dbWritePerByte: SpWeightsWeightV2Weight;
  readonly dbReadPerByte: SpWeightsWeightV2Weight;
  readonly codeInstrumentationCost: SpWeightsWeightV2Weight;
  readonly codeInstrumentationByteCost: SpWeightsWeightV2Weight;
}

/** @name PalletGearScheduleLimits (613) */
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
}

/** @name PalletGearScheduleInstructionWeights (614) */
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

/** @name PalletGearScheduleHostFnWeights (615) */
export interface PalletGearScheduleHostFnWeights extends Struct {
  readonly alloc: SpWeightsWeightV2Weight;
  readonly allocPerPage: SpWeightsWeightV2Weight;
  readonly free: SpWeightsWeightV2Weight;
  readonly grReserveGas: SpWeightsWeightV2Weight;
  readonly grUnreserveGas: SpWeightsWeightV2Weight;
  readonly grSystemReserveGas: SpWeightsWeightV2Weight;
  readonly grGasAvailable: SpWeightsWeightV2Weight;
  readonly grMessageId: SpWeightsWeightV2Weight;
  readonly grPayProgramRent: SpWeightsWeightV2Weight;
  readonly grProgramId: SpWeightsWeightV2Weight;
  readonly grSource: SpWeightsWeightV2Weight;
  readonly grValue: SpWeightsWeightV2Weight;
  readonly grValueAvailable: SpWeightsWeightV2Weight;
  readonly grSize: SpWeightsWeightV2Weight;
  readonly grRead: SpWeightsWeightV2Weight;
  readonly grReadPerByte: SpWeightsWeightV2Weight;
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

/** @name PalletGearScheduleMemoryWeights (616) */
export interface PalletGearScheduleMemoryWeights extends Struct {
  readonly lazyPagesSignalRead: SpWeightsWeightV2Weight;
  readonly lazyPagesSignalWrite: SpWeightsWeightV2Weight;
  readonly lazyPagesSignalWriteAfterRead: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncRead: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncWrite: SpWeightsWeightV2Weight;
  readonly lazyPagesHostFuncWriteAfterRead: SpWeightsWeightV2Weight;
  readonly loadPageData: SpWeightsWeightV2Weight;
  readonly uploadPageData: SpWeightsWeightV2Weight;
  readonly staticPage: SpWeightsWeightV2Weight;
  readonly memGrow: SpWeightsWeightV2Weight;
  readonly parachainReadHeuristic: SpWeightsWeightV2Weight;
}

/** @name PalletGearError (618) */
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
  readonly isValueLessThanMinimal: boolean;
  readonly isMessageQueueProcessingDisabled: boolean;
  readonly isResumePeriodLessThanMinimal: boolean;
  readonly isProgramNotFound: boolean;
  readonly isFailureRedeemingVoucher: boolean;
  readonly isGearRunAlreadyInBlock: boolean;
  readonly isProgramRentDisabled: boolean;
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
    | 'ValueLessThanMinimal'
    | 'MessageQueueProcessingDisabled'
    | 'ResumePeriodLessThanMinimal'
    | 'ProgramNotFound'
    | 'FailureRedeemingVoucher'
    | 'GearRunAlreadyInBlock'
    | 'ProgramRentDisabled';
}

/** @name PalletGearStakingRewardsError (621) */
export interface PalletGearStakingRewardsError extends Enum {
  readonly isFailureToRefillPool: boolean;
  readonly isFailureToWithdrawFromPool: boolean;
  readonly type: 'FailureToRefillPool' | 'FailureToWithdrawFromPool';
}

/** @name PalletGearBankBankAccount (623) */
export interface PalletGearBankBankAccount extends Struct {
  readonly gas: u128;
  readonly value: u128;
}

/** @name PalletGearBankError (624) */
export interface PalletGearBankError extends Enum {
  readonly isInsufficientBalance: boolean;
  readonly isInsufficientGasBalance: boolean;
  readonly isInsufficientValueBalance: boolean;
  readonly isInsufficientBankBalance: boolean;
  readonly isInsufficientDeposit: boolean;
  readonly type:
    | 'InsufficientBalance'
    | 'InsufficientGasBalance'
    | 'InsufficientValueBalance'
    | 'InsufficientBankBalance'
    | 'InsufficientDeposit';
}

/** @name PalletGearVoucherCall (279) */
export interface PalletGearVoucherCall extends Enum {
  readonly isIssue: boolean;
  readonly asIssue: {
    readonly spender: AccountId32;
    readonly balance: u128;
    readonly programs: Option<BTreeSet<GearCoreIdsProgramId>>;
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
    readonly appendPrograms: Option<Option<BTreeSet<GearCoreIdsProgramId>>>;
    readonly codeUploading: Option<bool>;
    readonly prolongDuration: Option<u32>;
  } & Struct;
  readonly isCallDeprecated: boolean;
  readonly asCallDeprecated: {
    readonly call: PalletGearVoucherInternalPrepaidCall;
  } & Struct;
  readonly type: 'Issue' | 'Call' | 'Revoke' | 'Update' | 'CallDeprecated';
}

/** @name PalletGearVoucherInternalVoucherId (282) */
export type PalletGearVoucherInternalVoucherId = U8aFixed;

export interface PalletGearVoucherInternalPrepaidCall extends Enum {
  readonly isSendMessage: boolean;
  readonly asSendMessage: {
    readonly destination: GearCoreIdsProgramId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isSendReply: boolean;
  readonly asSendReply: {
    readonly replyToId: GearCoreIdsMessageId;
    readonly payload: Bytes;
    readonly gasLimit: u64;
    readonly value: u128;
    readonly keepAlive: bool;
  } & Struct;
  readonly isUploadCode: boolean;
  readonly asUploadCode: {
    readonly code: Bytes;
  } & Struct;
  readonly type: 'SendMessage' | 'SendReply' | 'UploadCode';
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
  readonly type: 'VoucherIssued' | 'VoucherRevoked' | 'VoucherUpdated';
}

export /** @name PalletGearVoucherInternalVoucherInfo (627) */
interface PalletGearVoucherInternalVoucherInfo extends Struct {
  readonly owner: AccountId32;
  readonly programs: Option<BTreeSet<GearCoreIdsProgramId>>;
  readonly codeUploading: bool;
  readonly expiry: u32;
}

/** @name PalletGearVoucherError (627) */
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
