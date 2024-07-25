/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from '@tanstack/react-query';
import { TransactionBuilder } from 'sails-js';

import { usePrepareProgramTransaction } from './use-prepare-program-transaction';
import {
  FunctionName,
  GenericTransactionReturn,
  ServiceName,
  SignAndSendOptions,
  Transaction,
  TransactionReturn,
  UseSendProgramTransactionParameters,
} from './types';

// TODO: if there's no parameters - prepared transaction mode
function useSendProgramTransaction<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TFunctionName extends FunctionName<TProgram[TServiceName], GenericTransactionReturn>,
  TTransaction extends Transaction<TProgram[TServiceName][TFunctionName]>,
  TTransactionReturn extends TransactionReturn<TTransaction>,
>({ program, serviceName, functionName }: UseSendProgramTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { prepareTransactionAsync } = usePrepareProgramTransaction({ program, serviceName, functionName });

  const sendTransaction = async (
    transactionOrOptions: TTransactionReturn | SignAndSendOptions<Parameters<TTransaction>>,
  ) => {
    const transaction =
      transactionOrOptions instanceof TransactionBuilder
        ? transactionOrOptions
        : await prepareTransactionAsync(transactionOrOptions);

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

export { useSendProgramTransaction };
export type { UseSendProgramTransactionParameters };
