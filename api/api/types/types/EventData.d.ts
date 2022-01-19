import { MessageInfo, Reason, Reply, Message, ProgramDetails } from '../';
import { Vec, u64, u128, Option, u8, GenericEventData } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
export declare class GearEventData extends GenericEventData {
  constructor(data: GenericEventData);
}
export declare class MessageInfoData extends GearEventData {
  get messageId(): H256;
  get programId(): H256;
  get origin(): H256;
}
export declare class ProgramData extends GearEventData {
  get info(): MessageInfo;
  get reason(): Reason;
}
export declare class LogData extends GearEventData {
  get id(): H256;
  get source(): H256;
  get dest(): H256;
  get payload(): Vec<u8>;
  get gasLimit(): u64;
  get value(): u128;
  get reply(): Option<Reply>;
}
export declare class TransferData extends GearEventData {
  get from(): H256;
  get to(): H256;
  get value(): u128;
}
export declare class InitMessageEnqueuedData extends MessageInfoData {}
export declare class DispatchMessageEnqueuedData extends MessageInfoData {}
export declare class InitSuccessData extends MessageInfoData {}
export declare class InitFailureData extends ProgramData {}
export declare class DebugData extends GearEventData {
  get messageQueue(): Vec<Message>;
  get programs(): Vec<ProgramDetails>;
}
