import { MessageInfo, Reason, Reply, Message, ProgramDetails } from '../';
import { Vec, u64, u128, Option, u8, GenericEventData } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

export class GearEventData extends GenericEventData {
  constructor(data: GenericEventData) {
    super(data.registry, data.toU8a(), data.meta, data.section, data.method);
  }
}
export class MessageInfoData extends GearEventData {
  public get messageId(): H256 {
    return this.at(0)['messageId'] as H256;
  }
  public get programId(): H256 {
    return this.at(0)['programId'] as H256;
  }
  public get origin(): H256 {
    return this.at(0)['origin'] as H256;
  }
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

export class InitMessageEnqueuedData extends MessageInfoData {}
export class DispatchMessageEnqueuedData extends MessageInfoData {}
export class InitSuccessData extends MessageInfoData {}
export class InitFailureData extends ProgramData {}

export class DebugData extends GearEventData {
  public get message_queue(): Vec<Message> {
    return this.at(0)['message_queue'];
  }

  public get programs(): Vec<ProgramDetails> {
    return this.at(0)['programs'];
  }
}
