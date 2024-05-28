import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface RevokeArgs extends Args {
  /**
   * The voucher holder account id.
   */
  spender: string;

  /**
   * The id of the voucher to be revoked.
   */
  voucherId: string;
}

/**
 * Construct a decline voucher transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function revoke(args: RevokeArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'revoke',
        pallet: 'gearVoucher',
      },
      ...info,
    },
    options,
  );
}
