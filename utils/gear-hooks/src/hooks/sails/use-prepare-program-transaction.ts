import { web3FromSource } from '@polkadot/extension-dapp';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { AccountContext } from 'context';

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
  const { account: connectedAccount } = useContext(AccountContext);

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

      const { address, meta } = connectedAccount;
      const { signer } = await web3FromSource(meta.source);
      transaction.withAccount(address, { signer });
    }

    if (value !== undefined) transaction.withValue(value);
    if (voucherId) transaction.withVoucher(voucherId);

    if (typeof gasLimit === 'bigint') {
      await transaction.withGas(gasLimit);
    } else {
      const { allowOtherPanics, increaseGas } = gasLimit || {};
      await transaction.calculateGas(allowOtherPanics, increaseGas);
    }

    return transaction;
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
