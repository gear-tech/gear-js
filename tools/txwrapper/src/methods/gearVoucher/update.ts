import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface UpdateArgs extends Args {
  /**
   * The voucher holder account id.
   */
  spender: string;

  /**
   * The id of the voucher to be revoked.
   */
  voucherId: string;

  /**
   * The new voucher owner.
   */
  moveOwnership: string | null;

  /**
   * The new voucher balance.
   */
  balanceTopUp: number | string | null;

  /**
   * Append new programs to the voucher.
   */
  appendPrograms: string[] | null;

  /**
   * Enable or disable code uploading.
   */
  codeUploading: boolean | null;

  /**
   * Prolong the duration of th voucher validity.
   */
  prolongDuration: number | null;
}

/**
 * Construct a decline voucher transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function update(args: UpdateArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'update',
        pallet: 'gearVoucher',
      },
      ...info,
    },
    options,
  );
}
