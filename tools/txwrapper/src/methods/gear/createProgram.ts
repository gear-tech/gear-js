import { Args, BaseTxInfo, defineMethod, OptionsWithMeta, UnsignedTransaction } from '@substrate/txwrapper-core';

export interface CreateProgramArgs extends Args {
  /**
   * The code id from with the program is created.
   */
  codeId: string;

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

  /**
   * A flag that indicates whether the account should be kept alive after the value is sent to the program.
   */
  keepAlive: boolean;
}

/**
 * Construct a createProgram transaction offline.
 *
 * @param args - Arguments specific to this method.
 * @param info - Information required to construct the transaction.
 * @param options - Registry and metadata used for constructing the method.
 */
export function createProgram(
  args: CreateProgramArgs,
  info: BaseTxInfo,
  options: OptionsWithMeta,
): UnsignedTransaction {
  return defineMethod(
    {
      method: {
        args,
        name: 'createProgram',
        pallet: 'gear',
      },
      ...info,
    },
    options,
  );
}
