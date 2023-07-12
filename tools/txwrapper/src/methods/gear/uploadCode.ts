import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface UploadCodeArgs extends Args {
  /**
   * The code to upload.
   */
  code: string;
}

/**
 * Construct an uploadCode transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function uploadCode(args: UploadCodeArgs, info: BaseTxInfo, options: OptionsWithMeta): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'uploadCode',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
