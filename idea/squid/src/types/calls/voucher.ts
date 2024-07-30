import { Call } from '../../processor';
import { AUploadCode } from './code';
import { ASendMessage, ASendReply } from './message';

interface AVoucherSendMessage extends ASendMessage {
  __kind: 'SendMessage';
}

interface AVoucherSendReply extends ASendReply {
  __kind: 'SendReply';
}

export interface AVoucherUploadCode extends AUploadCode {
  __kind: 'UploadCode';
}

export interface AVoucherCall {
  call: AVoucherSendMessage | AVoucherSendReply | AVoucherUploadCode;
}

export type CVoucherCall = Omit<Call, 'args'> & { args: AVoucherCall };

export const isVoucherCall = (obj: any): obj is CVoucherCall => obj.name === 'GearVoucher.call';
