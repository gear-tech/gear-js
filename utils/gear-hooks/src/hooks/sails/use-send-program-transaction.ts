import { useMutation } from '@tanstack/react-query';

import {
  FunctionName,
  GenericTransactionReturn,
  SendTransactionParameters,
  ServiceName,
  SignAndSendOptions,
  Transaction,
  TransactionReturn,
  UseSendProgramTransactionParameters,
} from './types';
import { usePrepareProgramTransaction } from './use-prepare-program-transaction';

// TODO: if there's no parameters - prepared transaction mode
function useSendProgramTransaction<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TFunctionName extends FunctionName<TProgram[TServiceName], GenericTransactionReturn>,
  TTransaction extends Transaction<TProgram[TServiceName][TFunctionName]>,
  TTransactionReturn extends TransactionReturn<TTransaction>,
>({ program, serviceName, functionName }: UseSendProgramTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { prepareTransactionAsync } = usePrepareProgramTransaction({ program, serviceName, functionName });

  const sendTransaction = async ({
    awaitFinalization,
    ...transactionOptions
  }: ({ transaction: TTransactionReturn } | SignAndSendOptions<Parameters<TTransaction>>) &
    SendTransactionParameters) => {
    const { transaction } =
      'transaction' in transactionOptions ? transactionOptions : await prepareTransactionAsync(transactionOptions);

    const { blockHash, msgId, isFinalized, txHash, response } = await transaction.signAndSend();

    // maybe worth to make it optional via parameters.
    // would require function overload with some generics magic to return correct types only for specified values,
    // so for now it's fine
    const responseResult = await response();

    if (awaitFinalization) await isFinalized;

    return { response: responseResult, blockHash, msgId, txHash };
  };

  // depends on useProgram/program implementation, programId may not be available
  const programId = program && typeof program === 'object' && 'programId' in program ? program.programId : undefined;

  const mutation = useMutation({
    mutationKey: ['sendTransaction', programId, serviceName, functionName],
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
