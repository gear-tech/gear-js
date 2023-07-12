import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface SendReplyArgs extends Args {
  /**
   * The message id to reply to.
   */
  replyToId: string;

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
}

/**
 * Construct a sendReply transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function sendReply(args: SendReplyArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'sendReply',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
