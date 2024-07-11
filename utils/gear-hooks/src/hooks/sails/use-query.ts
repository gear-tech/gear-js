/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICalculateReplyForHandleOptions } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { UseQueryOptions, useQuery as useReactQuery } from '@tanstack/react-query';
import { ZERO_ADDRESS } from 'sails-js';

type PromiseReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;
type EventReturn = () => void;

type QueryName<T> = {
  [K in keyof T]: PromiseReturn<T[K]> extends EventReturn ? never : K;
}[keyof T];

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type ExcludeConfigArgs<T> = T extends [...infer U, any, any?, any?] ? U : T;
type NonConfigArgs<T> = T extends (...args: infer P) => Promise<any> ? ExcludeConfigArgs<P> : never;
type Query<T> = T extends (..._args: infer P) => Promise<infer R> ? (..._args: P) => Promise<R> : never;

type CalculateReplyOptions = Pick<ICalculateReplyForHandleOptions, 'at' | 'value'>;
type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>; // TODO: pass generics

type UseQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TQueryName;
  args: TArgs;
  calculateReply?: CalculateReplyOptions;
  query?: QueryOptions<TQueryReturn>;
};

function useQuery<
  TProgram,
  TServiceName extends Exclude<keyof TProgram, NonServiceKeys>,
  TQueryName extends QueryName<TProgram[TServiceName]>,
  TQuery extends Query<TProgram[TServiceName][TQueryName]>,
  TArgs extends NonConfigArgs<TQuery>,
  TQueryReturn extends Awaited<ReturnType<TQuery>>,
>({
  program,
  serviceName,
  functionName,
  args,
  calculateReply,
  query,
}: UseQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn>) {
  const { account } = useAccount();
  const originAddress = account?.decodedAddress || ZERO_ADDRESS;

  const getQuery = () => {
    if (!program) throw new Error('Program is not found');

    return (program[serviceName][functionName] as TQuery)(
      ...[...args, originAddress, calculateReply?.value, calculateReply?.at],
    ) as TQueryReturn;
  };

  // depends on useProgram/program implementation, programId may not be available
  const programId = program && typeof program === 'object' && 'programId' in program ? program.programId : undefined;

  return useReactQuery({
    ...query,
    queryKey: ['query', programId, originAddress, serviceName, functionName, args, calculateReply],
    queryFn: getQuery,
    enabled: Boolean(program) && (query?.enabled ?? true),
  });
}

export { useQuery };
export type { UseQueryParameters };
