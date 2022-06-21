import { u8, u32, u128, Vec, Option, BTreeMap, BTreeSet, GenericEventData, Bool } from '@polkadot/types';
import { BlockNumber, AccountId32 } from '@polkadot/types/interfaces';
import { Reply, QueuedDispatch, ProgramDetails } from '../types/interfaces';
import {
  MessageId,
  UserId,
  ProgramId,
  Entry,
  ProgramChangedKind,
  DispatchStatus,
  UserMessageReadReason,
  MessageWaitedReason,
  MessageWokenReason,
  CodeId,
  CodeChangeKind,
  UserMessageSentMessage,
} from '../types/gear-core';

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}

export interface MessageEnqueuedData extends GenericEventData {
  id: MessageId;
  source: UserId;
  destination: ProgramId;
  entry: Entry;
}

export interface UserMessageSentData extends GenericEventData {
  message: UserMessageSentMessage;
  expiration: BlockNumber;
}

export interface UserMessageReadData extends GenericEventData {
  id: MessageId;
  reason: UserMessageReadReason;
}

export interface MessagesDispatchedData extends GenericEventData {
  total: u32;
  statuses: BTreeMap<MessageId, DispatchStatus>;
  stateChanged: BTreeSet<ProgramId>;
}

export interface MessageWaitedData extends GenericEventData {
  id: MessageId;
  origin: Option<MessageId>;
  reason: MessageWaitedReason;
  expiration: BlockNumber;
}

export interface MessageWakenData extends GenericEventData {
  id: MessageId;
  reason: MessageWokenReason;
}

export interface CodeChangedData extends GenericEventData {
  id: CodeId;
  change: CodeChangeKind;
}

export interface ProgramChangedData extends GenericEventData {
  id: ProgramId;
  change: ProgramChangedKind;
}

export interface DebugData extends GenericEventData {
  dispatchQueue: Vec<QueuedDispatch>;
  programs: Vec<ProgramDetails>;
}

export interface DebugModeData extends GenericEventData {
  enabled: Bool;
}

export class TransferData extends GearEventData {
  public get from(): AccountId32 {
    return this[0] as AccountId32;
  }

  public get to(): AccountId32 {
    return this[1] as AccountId32;
  }
  public get value(): u128 {
    return this[2] as u128;
  }
}
