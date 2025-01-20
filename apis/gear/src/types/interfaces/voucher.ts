import { BalanceOf } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export type ICallOptions =
  | { SendMessage: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { SendReply: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { UploadCode: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { DeclineVoucher: null };

export interface IUpdateVoucherParams {
  /**
   * The new voucher owner.
   */
  moveOwnership?: string;
  /**
   * The new voucher balance.
   */
  balanceTopUp?: number | bigint | BalanceOf;
  /**
   * Append new programs to the voucher.
   */
  appendPrograms?: string[];
  /**
   * Enable or disable code uploading.
   */
  codeUploading?: boolean;
  /**
   * Prolong the duration of th voucher validity.
   */
  prolongDuration?: number;
}

export interface IVoucherDetails {
  /**
   * The voucher owner.
   */
  owner: HexString;
  /**
   * The block number at and after which voucher couldn't be used and can be revoked by owner.
   */
  expiry: number;
  /**
   * Set of programs this voucher could be used to interact with. If null, the voucher could be used with any program.
   */
  programs: string[] | null;
  /**
   * Flag if this voucher's covers uploading codes as prepaid call.
   */
  codeUploading: boolean;
}
