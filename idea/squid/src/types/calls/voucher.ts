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

export interface AIssueVoucherTx {
  spender: string;
  balance: string;
  programs: string[];
  codeUploading: boolean;
  duration: number;
}

export type CVoucherIssued = Omit<Call, 'args'> & { args: AIssueVoucherTx };

export interface AUpdateVoucherTx {
  spender: string;
  voucherId: string;
  moveOwnership?: string;
  balanceTopUp?: string;
  appendPrograms: { __kind: 'None' | 'Some'; value: string[] };
  codeUploading?: boolean;
  prolongDuration?: number;
}

export type CVoucherUpdated = Omit<Call, 'args'> & { args: AUpdateVoucherTx };
