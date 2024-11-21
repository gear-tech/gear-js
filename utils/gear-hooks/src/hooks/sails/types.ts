/* eslint-disable @typescript-eslint/no-explicit-any */
import { HexString } from '@gear-js/api';
import { SignerOptions } from '@polkadot/api/types';
import { IKeyringPair } from '@polkadot/types/types';
import { UseQueryOptions } from '@tanstack/react-query';
import { TransactionBuilder } from 'sails-js';

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

// events
type EventReturn = Promise<() => void>;
type Event<T> = T extends (...args: infer P) => EventReturn ? (...args: P) => EventReturn : never;
type EventCallbackArgs<T> = Parameters<Event<T>>[0] extends (...args: infer P) => void | Promise<void> ? P : never;

// queries

type PromiseReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

// is it possible to combine with FunctionName?
type QueryName<T> = {
  [K in keyof T]: PromiseReturn<T[K]> extends Awaited<EventReturn> ? never : K;
}[keyof T];

type ExcludeConfigArgs<T> = T extends [...infer U, any, any?, any?] ? U : T;
type NonConfigArgs<T> = T extends (...args: infer P) => Promise<any> ? ExcludeConfigArgs<P> : never;

type Query<T> = T extends (...args: infer P) => Promise<infer R> ? (...args: P) => Promise<R> : never;
type QueryArgs<T> = NonConfigArgs<T>;
type QueryReturn<T> = Awaited<ReturnType<Query<T>>>;

// tanstack/react-query

type QueryParameters<TQueryFnData, TData> = {
  query: Omit<UseQueryOptions<TQueryFnData, Error, TData, (string | undefined)[]>, 'queryKey' | 'queryFn'>;
};

export type {
  ServiceName,
  FunctionName,
  GenericTransactionReturn,
  Transaction,
  TransactionReturn,
  UseSendProgramTransactionParameters,
  UsePrepareProgramTransactionParameters,
  SignAndSendOptions,
  EventReturn,
  Event,
  EventCallbackArgs,
  QueryName,
  Query,
  QueryArgs,
  QueryReturn,
  QueryParameters,
};
