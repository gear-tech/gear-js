/* eslint-disable @typescript-eslint/no-explicit-any */
import { HexString } from '@gear-js/api';
import { SignerOptions } from '@polkadot/api/types';
import { IKeyringPair } from '@polkadot/types/types';
import { QueryBuilder, TransactionBuilder } from 'sails-js';

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type ServiceName<TProgram> = Exclude<keyof TProgram, NonServiceKeys>;

type FunctionName<T, TReturn> = {
  [K in keyof T]: T[K] extends (...args: any[]) => TReturn ? K : never;
}[keyof T];

// transactions
type GenericTransactionReturn<T = any> = TransactionBuilder<T>;

type Transaction<T> = T extends (...args: infer P) => GenericTransactionReturn<infer R>
  ? (...args: P) => GenericTransactionReturn<R>
  : never;

// unwrapping value and wrapping it again,
// cuz somehow useSendProgramTransaction is not able to interpret usePrepareProgramTransaction's return type
type _TransactionReturn<T> = ReturnType<Transaction<T>> extends GenericTransactionReturn<infer R> ? R : never;
type TransactionReturn<T> = GenericTransactionReturn<_TransactionReturn<T>>;

type UseSendProgramTransactionParameters<TProgram, TServiceName, TFunctionName> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TFunctionName;
};

type UsePrepareProgramTransactionParameters<TProgram, TServiceName, TFunctionName> =
  UseSendProgramTransactionParameters<TProgram, TServiceName, TFunctionName>;

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

type SendTransactionParameters = {
  awaitFinalization?: boolean;
};

// events
type EventReturn = Promise<() => void>;
type Event<T> = T extends (...args: infer P) => EventReturn ? (...args: P) => EventReturn : never;
type EventCallbackArgs<T> = Parameters<Event<T>>[0] extends (...args: infer P) => void | Promise<void> ? P : never;

// queries

type GenericQueryReturn<T = any> = QueryBuilder<T>;

type Query<T> = T extends (...args: infer P) => GenericQueryReturn<infer R>
  ? (...args: P) => GenericQueryReturn<R>
  : never;

type QueryArgs<T> = Parameters<Query<T>>;
type QueryReturn<T> = Query<T> extends (...args: any[]) => GenericQueryReturn<infer R> ? R : never;

export type {
  ServiceName,
  FunctionName,
  GenericTransactionReturn,
  Transaction,
  TransactionReturn,
  UseSendProgramTransactionParameters,
  UsePrepareProgramTransactionParameters,
  SignAndSendOptions,
  SendTransactionParameters,
  EventReturn,
  Event,
  EventCallbackArgs,
  GenericQueryReturn,
  Query,
  QueryArgs,
  QueryReturn,
};
