import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface UploadProgramArgs extends Args {
  /**
   * The code to upload.
   */
  code: string;

  /**
   * Salt for the program.
   */
  salt: string;

  /**
   * The initial input data for the program.
   */
  initPayload: string;

  /**
   * Gas limit for the program.
   */
  gasLimit: string | number;

  /**
   * The value to be transferred to the program.
   */
  value: string | number;
}

/**
 * Construct an uploadProgram transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function uploadProgram(
  args: UploadProgramArgs,
  info: BaseTxInfo,
  options: OptionsWithMeta,
): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'uploadProgram',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
