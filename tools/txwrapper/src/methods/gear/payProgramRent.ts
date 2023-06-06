import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface PayProgramRentArgs extends Args {
  /**
   * The program id.
   */
  programId: string;

  /**
   * The block count to pay for.
   */
  blockCount: string;
}

/**
 * Construct a payProgramRent transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function payProgramRent(
  args: PayProgramRentArgs,
  info: BaseTxInfo,
  options: OptionsWithMeta,
): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'payProgramRent',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
