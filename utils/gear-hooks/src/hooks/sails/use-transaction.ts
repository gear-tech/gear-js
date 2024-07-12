/* eslint-disable @typescript-eslint/no-explicit-any */
import { HexString } from '@gear-js/api';
import { SignerOptions } from '@polkadot/api/types';
import { IKeyringPair } from '@polkadot/types/types';
import { useMutation } from '@tanstack/react-query';
import { TransactionBuilder } from 'sails-js';

import { usePrepareTransaction } from './use-prepare-transaction';

type FunctionName<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => TransactionBuilder<any> ? K : never;
}[keyof T];

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type UseTransactionParameters<TProgram, TServiceName, TFunctionName> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TFunctionName;
};

type CalculateGasParameters = {
  allowOtherPanics?: boolean;
  increaseGas?: number;
};

type AccountParameters = {
  addressOrPair: string | IKeyringPair;
  signerOptions?: Partial<SignerOptions>;
};

type SignAndSendOptions<T> = {
  args: T;
  value?: bigint;
  voucherId?: HexString;
  gasLimit?: bigint | CalculateGasParameters;
  account?: AccountParameters;
};

// TODO: if there's no parameters - prepared transaction mode
function useTransaction<
  TProgram,
  TServiceName extends Exclude<keyof TProgram, NonServiceKeys>,
  TFunctionName extends FunctionName<TProgram[TServiceName]>,
>({ program, serviceName, functionName }: UseTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { getTransactionAsync } = usePrepareTransaction({ program, serviceName, functionName });

  type FunctionType = TProgram[TServiceName][TFunctionName] extends (...args: infer A) => TransactionBuilder<infer R>
    ? (...args: A) => TransactionBuilder<R>
    : never;

  type Return = ReturnType<FunctionType> extends TransactionBuilder<infer R> ? R : never;

  const sendTransaction = async (
    transactionOrOptions: TransactionBuilder<Return> | SignAndSendOptions<Parameters<FunctionType>>,
  ) => {
    const transaction =
      transactionOrOptions instanceof TransactionBuilder
        ? transactionOrOptions
        : await getTransactionAsync(transactionOrOptions);

    // would make sense to await isFinalized and response properties?
    return transaction.signAndSend();
  };

  const mutation = useMutation({
    mutationKey: ['sendTransaction'],
    mutationFn: sendTransaction,
  });

  return {
    sendTransaction: mutation.mutate,
    sendTransactionAsync: mutation.mutateAsync,
    ...mutation,
  };
}

export { useTransaction };
export type { UseTransactionParameters };
