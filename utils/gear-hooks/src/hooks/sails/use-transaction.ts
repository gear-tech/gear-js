/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { TransactionBuilder } from 'sails-js';

type FunctionName<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => TransactionBuilder<any> ? K : never;
}[keyof T];

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type UseTransactionParameters<TProgram, TServiceName, TFunctionName> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TFunctionName;
};

function useTransaction<
  TProgram,
  TServiceName extends Exclude<keyof TProgram, NonServiceKeys>,
  TFunctionName extends FunctionName<TProgram[TServiceName]>,
>({ program, serviceName, functionName }: UseTransactionParameters<TProgram, TServiceName, TFunctionName>) {
  const { account } = useAccount();

  type FunctionType = TProgram[TServiceName][TFunctionName] extends (...args: infer A) => TransactionBuilder<infer R>
    ? (...args: A) => TransactionBuilder<R>
    : never;

  return async (...args: Parameters<FunctionType>) => {
    if (!program) throw new Error('Program is not found');
    if (!account) throw new Error('Account is not found');

    const transaction = (program[serviceName][functionName] as FunctionType)(...args) as ReturnType<FunctionType>;

    const { address, meta } = account;
    const { signer } = await web3FromSource(meta.source);
    transaction.withAccount(address, { signer });

    return transaction;
  };
}

export { useTransaction };
export type { UseTransactionParameters };
