import { MessageInfo, Reason, Reply, QueuedDispatch, ProgramDetails } from '../types/interfaces';
import { Vec, u128, Option, u8, GenericEventData, Null, Bytes, Type } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}
export class MessageInfoData extends GearEventData {
  public get messageId(): H256 {
    return this[0]['messageId'] as H256;
  }
  public get programId(): H256 {
    return this[0]['programId'] as H256;
  }
  public get origin(): H256 {
    return this[0]['origin'] as H256;
  }
}

export class ProgramData extends GearEventData {
  public get info(): MessageInfo {
    return this[0] as MessageInfo;
  }
  public get reason(): Reason {
    if (this.length > 1) {
      return this[1] as Reason;
    }
    return null;
  }
}

export class LogData extends GearEventData {
  public get id(): H256 {
    return this[0]['id'];
  }
  public get source(): H256 {
    return this[0]['source'];
  }
  public get destination(): H256 {
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
}

export class TransferData extends GearEventData {
  public get from(): H256 {
    return this[0] as H256;
  }

  public get to(): H256 {
    return this[1] as H256;
  }
  public get value(): u128 {
    return this[2] as u128;
  }
}

export class InitMessageEnqueuedData extends MessageInfoData {}
export class DispatchMessageEnqueuedData extends MessageInfoData {}
export class InitSuccessData extends MessageInfoData {}
export class InitFailureData extends ProgramData {}

export class DebugData extends GearEventData {
  public get dispatchQueue(): Vec<QueuedDispatch> {
    return this[0]['dispatchQueue'];
  }

  public get programs(): Vec<ProgramDetails> {
    return this[0]['programs'];
  }
}

export class ExecutionResult extends Type {
  public get isSuccess(): boolean {
    return this.isSuccess;
  }

  public get isFailure(): boolean {
    return this.isFailure;
  }

  public get asSuccess(): Null {
    return this.asSuccess;
  }

  public get asFailure(): Bytes {
    return this.asFailure;
  }
}

export class MessageDispatchedData extends GearEventData {
  public get messageId(): H256 {
    return this[0]['messageId'];
  }

  public get outcome(): ExecutionResult {
    return this[0]['outcome'] as ExecutionResult;
  }
}
