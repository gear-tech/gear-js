import { AccountId32, BlockNumber } from '@polkadot/types/interfaces';
import { BTreeMap, BTreeSet, GenericEventData, Option, u128, u32 } from '@polkadot/types';

import {
  CodeId,
  GasNodeId,
  GearCommonEventCodeChangeKind,
  GearCommonEventDispatchStatus,
  GearCommonEventMessageEntry,
  GearCommonEventProgramChangeKind,
  GearCommonEventReasonMessageWaitedRuntimeReason,
  GearCommonEventReasonMessageWokenRuntimeReason,
  GearCommonEventReasonUserMessageReadRuntimeReason,
  GearCoreMessageUserUserMessage,
  MessageId,
  PalletGearVoucherInternalVoucherId,
  ProgramId,
  ReservationId,
  ResumeProgramSessionId,
} from '../types';

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}

export interface MessageQueuedData extends GenericEventData {
  id: MessageId;
  source: AccountId32;
  destination: ProgramId;
  entry: GearCommonEventMessageEntry;
}

export interface UserMessageSentData extends GenericEventData {
  message: GearCoreMessageUserUserMessage;
  expiration: Option<BlockNumber>;
}

export interface UserMessageReadData extends GenericEventData {
  id: MessageId;
  reason: GearCommonEventReasonUserMessageReadRuntimeReason;
}

export interface MessagesDispatchedData extends GenericEventData {
  total: u32;
  statuses: BTreeMap<MessageId, GearCommonEventDispatchStatus>;
  stateChanges: BTreeSet<ProgramId>;
}

export interface MessageWaitedData extends GenericEventData {
  id: MessageId;
  origin: Option<GasNodeId<MessageId, ReservationId>>;
  reason: GearCommonEventReasonMessageWaitedRuntimeReason;
  expiration: BlockNumber;
}

export interface MessageWakenData extends GenericEventData {
  id: MessageId;
  reason: GearCommonEventReasonMessageWokenRuntimeReason;
}

export interface CodeChangedData extends GenericEventData {
  id: CodeId;
  change: GearCommonEventCodeChangeKind;
}

export interface ProgramChangedData extends GenericEventData {
  id: ProgramId;
  change: GearCommonEventProgramChangeKind;
}

export interface TransferData extends GenericEventData {
  from: AccountId32;
  to: AccountId32;
  amount: u128;
}

export interface ProgramResumeSessionStartedData extends GenericEventData {
  sessionId: ResumeProgramSessionId;
  accountId: AccountId32;
  programId: ProgramId;
  sessionEndBlock: BlockNumber;
}

export interface VoucherIssuedData extends GenericEventData {
  voucherId: PalletGearVoucherInternalVoucherId;
}

export type VoucherUpdatedData = VoucherIssuedData;

export type VoucherRevokedData = VoucherIssuedData;
