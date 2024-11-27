import { HexString, ICalculateReplyForHandleOptions } from '@gear-js/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useAccount, useApi } from 'context';

import { QueryParameters } from '../../types';
import { useQuery } from '../use-query';
import { Query, QueryArgs, QueryName, QueryReturn, ServiceName } from './types';

type CalculateReplyOptions = Pick<ICalculateReplyForHandleOptions, 'at' | 'value'>;

type UseProgramQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn, TData> = QueryParameters<
  TQueryReturn,
  TData
> & {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TQueryName;
  args: TArgs;
  originAddress?: string;
  calculateReply?: CalculateReplyOptions;
  watch?: boolean;
};

function useProgramQuery<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TQueryName extends QueryName<TProgram[TServiceName]>,
  TQuery extends Query<TProgram[TServiceName][TQueryName]>,
  TArgs extends QueryArgs<TQuery>,
  TQueryReturn extends QueryReturn<TQuery>,
  TData = TQueryReturn,
>({
  program,
  serviceName,
  functionName,
  args,
  calculateReply,
  query,
  watch,
  ...params
}: UseProgramQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn, TData>) {
  const { api, isApiReady } = useApi();
  const queryClient = useQueryClient();

  const { account } = useAccount();
  const originAddress = 'originAddress' in params ? params.originAddress : account?.decodedAddress;

  const getQuery = () => {
    if (!program) throw new Error('Program is not found');

    return (program[serviceName][functionName] as TQuery)(
      ...[...args, originAddress, calculateReply?.value, calculateReply?.at],
    ) as TQueryReturn;
  };

  // depends on useProgram/program implementation, programId may not be available
  const programId =
    program && typeof program === 'object' && 'programId' in program ? (program.programId as HexString) : undefined;

  const queryKey = useMemo(
    () => [
      'query',
      programId,
      originAddress,
      serviceName as string, // TODO: can we remove this cast by giving TProgram some type to extend?
      functionName as string,
      JSON.stringify(args), // stringify for types consistency, is it a good practice?
      JSON.stringify(calculateReply),
    ],
    [programId, originAddress, serviceName, functionName, args, calculateReply],
  );

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
