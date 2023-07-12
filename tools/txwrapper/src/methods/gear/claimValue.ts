import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface ClaimValueArgs extends Args {
  /**
   * The id of the message in mailbox.
   */
  messageId: string;
}

/**
 * Construct a claim_value transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function claimValue(args: ClaimValueArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'claimValue',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
