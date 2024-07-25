/* eslint-disable @typescript-eslint/no-explicit-any */
import { HexString, ICalculateReplyForHandleOptions } from '@gear-js/api';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useQueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ZERO_ADDRESS } from 'sails-js';

import { Query, QueryArgs, QueryName, QueryReturn, ServiceName } from './types';

type CalculateReplyOptions = Pick<ICalculateReplyForHandleOptions, 'at' | 'value'>;
type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>; // TODO: pass generics

type UseProgramQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TQueryName;
  args: TArgs;
  calculateReply?: CalculateReplyOptions;
  query?: QueryOptions<TQueryReturn>;
  watch?: boolean;
};

function useProgramQuery<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TQueryName extends QueryName<TProgram[TServiceName]>,
  TQuery extends Query<TProgram[TServiceName][TQueryName]>,
  TArgs extends QueryArgs<TQuery>,
  TQueryReturn extends QueryReturn<TQuery>,
>({
  program,
  serviceName,
  functionName,
  args,
  calculateReply,
  query,
  watch,
}: UseProgramQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn>) {
  const { api, isApiReady } = useApi();
  const queryClient = useQueryClient();

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
  const queryKey = ['query', programId, originAddress, serviceName, functionName, args, calculateReply];

  useEffect(() => {
    if (!isApiReady || !watch) return;

    const unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data }) => {
      const changedIDs = data.stateChanges.toHuman() as HexString[];
      const isAnyChange = changedIDs.some((id) => id === programId);

      if (!isAnyChange) return;

      queryClient.invalidateQueries({ queryKey });
    });

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, programId, watch]);

  return useQuery({
    ...query,
    queryKey,
    queryFn: getQuery,
    enabled: Boolean(program) && (query?.enabled ?? true),
  });
}

export { useProgramQuery };
export type { UseProgramQueryParameters };
