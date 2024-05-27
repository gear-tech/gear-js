import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';
import { SendMessageArgs } from '../gear/sendMessage';
import { SendReplyArgs } from '../gear/sendReply';
import { UploadCodeArgs } from '../gear/uploadCode';
import { DeclineArgs } from './decline';

export interface SendMessageWithVoucher extends Args {
  SendMessage: SendMessageArgs;
}

export interface SendReplyWithVoucher extends Args {
  SendReply: SendReplyArgs;
}

export interface UploadCodeWithVoucher extends Args {
  UploadCode: UploadCodeArgs;
}

export interface DeclineVoucherWithVoucher extends Args {
  DeclineVoucher: DeclineArgs;
}

export interface CallArgs extends Args {
  /**
   * The id of the voucher to be used.
   */
  voucherId: string;

  /**
   * Call options
   */
  call: SendMessageWithVoucher | SendReplyWithVoucher | UploadCodeWithVoucher | DeclineVoucherWithVoucher;
}

/**
 * Construct a createProgram transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function call(args: CallArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'call',
        pallet: 'gearVoucher',
      },
      ...info,
    },
    options,
  );
}
