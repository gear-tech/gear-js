import { Vec, u64, u128, Option, u8, i32, Tuple, Null, GenericEventData, GenericEvent } from '@polkadot/types';
import { H256, Event } from '@polkadot/types/interfaces';

export class GearEvent extends GenericEvent {
  constructor(event: Event) {
    super(event.registry, event.toU8a());
  }
}

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}

export class ProgramEvent extends GearEvent {
  public get data() {
    return new ProgramData(this.get('data') as ProgramData);
  }
}

export class LogEvent extends GearEvent {
  public get data(): LogData {
    return new LogData(this.get('data') as LogData);
  }
}

export class TransferEvent extends GearEvent {
  public get data(): TransferData {
    return new TransferData(this.get('data') as TransferData);
  }
}

export declare interface MessageInfo extends GenericEventData {
  messageId: H256;
  programId: H256;
  origin: H256;
}

export declare interface Reason extends GenericEventData {
  isError: Boolean;
  asError: Null;
  isValueTransfer: Boolean;
  asValueTransfer: Null;
  isDispatch: Boolean;
  asDispatch: Vec<u8>;
}

export class ProgramData extends GearEventData {
  public get info(): MessageInfo {
    return this.at(0) as MessageInfo;
  }
  public get reason(): Reason {
    if (this.length > 1) {
      return this.at(1) as Reason;
    }
    return null;
  }
}

export declare interface Reply extends Tuple {
  0: H256;
  1: i32;
}

export declare interface LogInfo extends GenericEventData {
  id: H256;
  source: H256;
  dest: H256;
  payload: Vec<u8>;
  gasLimit: u64;
  value: u128;
  reply: Option<Reply>;
}

export class LogData extends GearEventData {
  public get id(): H256 {
    return this.at(0)['id'];
  }
  public get source(): H256 {
    return this.at(0)['source'];
  }
  public get dest(): H256 {
    return this.at(0)['dest'];
  }
  public get payload(): Vec<u8> {
    return this.at(0)['payload'];
  }
  public get gasLimit(): u64 {
    return this.at(0)['gasLimit'];
  }
  public get value(): u128 {
    return this.at(0)['value'];
  }
  public get reply(): Option<Reply> {
    return this.at(0)['reply'];
  }
}

export declare interface InitMessageEnqueuedData extends MessageInfo {}

export declare interface DispatchMessageEnqueuedData extends MessageInfo {}

export class TransferData extends GearEventData {
  public get from(): H256 {
    return this.at(0) as H256;
  }

  public get to(): H256 {
    return this.at(1) as H256;
  }
  public get value(): u128 {
    return this.at(2) as u128;
  }
}
