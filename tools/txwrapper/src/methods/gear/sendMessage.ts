import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface SendMessageArgs extends Args {
  /**
   * The destination address.
   */
  destination: string;

  /**
   * The input data for the message.
   */
  payload: string;

  /**
   * Gas limit for the message.
   */
  gasLimit: string | number;

  /**
   * The value to be transferred to the program.
   */
  value: string | number;

  /**
   * A flag that indicates whether the account should be kept alive after the value is sent to the program.
   */
  keepAlive: boolean;
}

/**
 * Construct a sendMessage transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function sendMessage(args: SendMessageArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'sendMessage',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
