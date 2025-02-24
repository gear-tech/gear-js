import { useMutation } from '@tanstack/react-query';

import { useAccount } from '@/context';

import {
  FunctionName,
  ServiceName,
  GenericTransactionReturn,
  Transaction,
  TransactionReturn,
  UsePrepareProgramTransactionParameters,
  SignAndSendOptions,
} from './types';

function usePrepareProgramTransaction<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TFunctionName extends FunctionName<TProgram[TServiceName], GenericTransactionReturn>,
  TTransaction extends Transaction<TProgram[TServiceName][TFunctionName]>,
  TTransactionReturn extends TransactionReturn<TTransaction>,
>({
  program,
  serviceName,
  functionName,
}: UsePrepareProgramTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { account: connectedAccount } = useAccount();

  const prepareTransaction = async ({
    args,
    value,
    voucherId,
    account,
    gasLimit,
  }: SignAndSendOptions<Parameters<TTransaction>>) => {
    if (!program) throw new Error('Program is not found');

    // spreading args to avoid TS error
    const transaction = (program[serviceName][functionName] as TTransaction)(...[...args]) as TTransactionReturn;

    if (account) {
      const { addressOrPair, signerOptions } = account;
      transaction.withAccount(addressOrPair, signerOptions);
    } else {
      if (!connectedAccount) throw new Error('Account is not found');

      const { address, signer } = connectedAccount;
      transaction.withAccount(address, { signer });
    }

    if (value !== undefined) transaction.withValue(value);
    if (voucherId) transaction.withVoucher(voucherId);

    if (typeof gasLimit === 'bigint') {
      transaction.withGas(gasLimit);
    } else {
      const { allowOtherPanics, increaseGas } = gasLimit || {};
      await transaction.calculateGas(allowOtherPanics, increaseGas);
    }

    // maybe worth to make it optional via parameters.
    // would require function overload with some generics magic to return correct types only for specified values,
    // so for now it's fine
    const awaited = {
      fee: await transaction.transactionFee(),
    };

    return { transaction, awaited };
  };

  const mutation = useMutation({
    mutationKey: ['prepareTransaction'],
    mutationFn: prepareTransaction,
  });

  return {
    prepareTransaction: mutation.mutate,
    prepareTransactionAsync: mutation.mutateAsync,
    ...mutation,
  };
}

export { usePrepareProgramTransaction };
export type { UsePrepareProgramTransactionParameters };
