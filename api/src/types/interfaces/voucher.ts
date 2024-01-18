import { BalanceOf } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export type ICallOptions =
  | { SendMessage: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { SendReply: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { UploadCode: SubmittableExtrinsic<'promise', ISubmittableResult> };

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
   * The voucher validity.
   */
  expiry: number;
  /**
   * The voucher programs.
   */
  programs: string[];
}
