import { BalanceOf } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export type ICallOptions =
  | { SendMessage: SubmittableExtrinsic<'promise', ISubmittableResult> }
  | { SendReply: SubmittableExtrinsic<'promise', ISubmittableResult> };

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
   * Prolong the voucher validity.
   */
  prolongValidity?: number;
}
