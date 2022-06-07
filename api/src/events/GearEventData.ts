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
} from '../types/gear-core';

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}

export class MessageEnqueuedData extends GearEventData {
  public get id(): MessageId {
    return this[0] as MessageId;
  }

  public get source(): UserId {
    return this[1] as UserId;
  }

  public get destination(): ProgramId {
    return this[2] as ProgramId;
  }

  public get entry(): Entry {
    return this[3] as Entry;
  }
}

export class UserMessageSentData extends GearEventData {
  public get id(): MessageId {
    return this[0]['id'];
  }
  public get source(): ProgramId {
    return this[0]['source'];
  }
  public get destination(): UserId {
    return this[0]['destination'];
  }
  public get payload(): Vec<u8> {
    return this[0]['payload'];
  }
  public get value(): u128 {
    return this[0]['value'];
  }
  public get reply(): Option<Reply> {
    return this[0]['reply'];
  }
  public get expiration(): BlockNumber {
    return this[1] as BlockNumber;
  }
}

export class UserMessageReadData extends GearEventData {
  public get id(): MessageId {
    return this[0] as MessageId;
  }

  public get reason(): UserMessageReadReason {
    return this[1] as UserMessageReadReason;
  }
}

export class MessagesDispatchedData extends GearEventData {
  public get total(): u32 {
    return this[0] as u32;
  }

  public get statuses(): BTreeMap<MessageId, DispatchStatus> {
    return this[1] as BTreeMap<MessageId, DispatchStatus>;
  }

  public get stateChanged(): BTreeSet<ProgramId> {
    return this[2] as BTreeSet<ProgramId>;
  }
}

export class MessageWaitedData extends GearEventData {
  public get id(): MessageId {
    return this[0] as MessageId;
  }

  public get origin(): Option<MessageId> {
    return this[1] as Option<MessageId>;
  }

  public get reason(): MessageWaitedReason {
    return this[2] as MessageWaitedReason;
  }

  public get expiration(): BlockNumber {
    return this[3] as BlockNumber;
  }
}

export class MessageWokenData extends GearEventData {
  public get id(): MessageId {
    return this[0] as MessageId;
  }

  public get reason(): MessageWokenReason {
    return this[1] as MessageWokenReason;
  }
}

export class CodeChangedData extends GearEventData {
  public get id(): CodeId {
    return this[0] as CodeId;
  }
  public get change(): CodeChangeKind {
    return this[1] as CodeChangeKind;
  }
}

export class ProgramChangedData extends GearEventData {
  public get id(): ProgramId {
    return this[0] as ProgramId;
  }
  public get change(): ProgramChangedKind {
    return this[1] as ProgramChangedKind;
  }
}

export class DebugData extends GearEventData {
  public get dispatchQueue(): Vec<QueuedDispatch> {
    return this[0]['dispatchQueue'];
  }

  public get programs(): Vec<ProgramDetails> {
    return this[0]['programs'];
  }
}

export class DebugModeData extends GearEventData {
  public get enabled(): Bool {
    return this[0] as Bool;
  }
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
