import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface DeclineArgs extends Args {
  /**
   * The id of the voucher to be declined.
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
export function decline(args: DeclineArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'decline',
        pallet: 'gearVoucher',
      },
      ...info,
    },
    options,
  );
}
