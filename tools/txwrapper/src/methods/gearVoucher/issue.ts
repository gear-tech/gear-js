import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface IssueArgs extends Args {
  /**
   * The voucher holder account id.
   */
  spender: string;

  /**
   * The voucher amount.
   */
  value: string | number;

  /**
   * The number of the block until which the voucher is valid. If not specified, the voucher is valid in `api.voucher.minDuration` blocks.
   */
  duration: string | number;

  /**
   * The list of programs that the voucher can be used for. If not specified, the voucher can be used for any program.
   */
  programs: string[] | null;

  /**
   * Whether the voucher can be used for uploading code.
   */
  codeUploading: boolean;
}

/**
 * Construct a decline voucher transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function issue(args: IssueArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'issue',
        pallet: 'gearVoucher',
      },
      ...info,
    },
    options,
  );
}
