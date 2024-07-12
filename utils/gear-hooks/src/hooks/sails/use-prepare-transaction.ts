/* eslint-disable @typescript-eslint/no-explicit-any */
import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { SignerOptions } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { IKeyringPair } from '@polkadot/types/types';
import { useMutation } from '@tanstack/react-query';
import { TransactionBuilder } from 'sails-js';

type FunctionName<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => TransactionBuilder<any> ? K : never;
}[keyof T];

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type UsePrepareTransactionParameters<TProgram, TServiceName, TFunctionName> = {
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

function usePrepareTransaction<
  TProgram,
  TServiceName extends Exclude<keyof TProgram, NonServiceKeys>,
  TFunctionName extends FunctionName<TProgram[TServiceName]>,
>({ program, serviceName, functionName }: UsePrepareTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { account: connectedAccount } = useAccount();

  type FunctionType = TProgram[TServiceName][TFunctionName] extends (...args: infer A) => TransactionBuilder<infer R>
    ? (...args: A) => TransactionBuilder<R>
    : never;

  type Return = ReturnType<FunctionType> extends TransactionBuilder<infer R> ? R : never;

  const getTransaction = async ({
    args,
    value,
    voucherId,
    account,
    gasLimit,
  }: SignAndSendOptions<Parameters<FunctionType>>) => {
    if (!program) throw new Error('Program is not found');

    const transaction = (program[serviceName][functionName] as FunctionType)(...args) as TransactionBuilder<Return>;

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
    mutationKey: ['getTransaction'],
    mutationFn: getTransaction,
  });

  return {
    getTransaction: mutation.mutate,
    getTransactionAsync: mutation.mutateAsync,
    ...mutation,
  };
}

export { usePrepareTransaction };
export type { UsePrepareTransactionParameters };
