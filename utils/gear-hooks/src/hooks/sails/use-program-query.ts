import { HexString } from '@gear-js/api';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useAccount, useApi } from '@/context';

import { QueryParameters } from '../../types';
import { useQuery } from '../use-query';

import { FunctionName, GenericQueryReturn, Query, QueryArgs, QueryReturn, ServiceName } from './types';

type UseProgramQueryParameters<TProgram, TServiceName, TQueryName, TArgs, TQueryReturn, TData> = QueryParameters<
  TQueryReturn,
  TData
> & {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TQueryName;
  args: TArgs;
  originAddress?: HexString;
  value?: bigint;
  gasLimit?: bigint;
  atBlock?: HexString;
  watch?: boolean;
};

function useProgramQuery<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TFunctionName extends FunctionName<TProgram[TServiceName], GenericQueryReturn>,
  TQuery extends Query<TProgram[TServiceName][TFunctionName]>,
  TArgs extends QueryArgs<TQuery>,
  TQueryReturn extends QueryReturn<TQuery>,
  TData = TQueryReturn,
>({
  program,
  serviceName,
  functionName,
  args,
  originAddress,
  value,
  gasLimit,
  atBlock,
  query,
  watch,
}: UseProgramQueryParameters<TProgram, TServiceName, TFunctionName, TArgs, TQueryReturn, TData>) {
  const { api, isApiReady } = useApi();
  const queryClient = useQueryClient();

  const { account } = useAccount();
  const address = originAddress || account?.decodedAddress;

  const getQuery = () => {
    if (!program) throw new Error('Program is not found');

    const programQuery = (program[serviceName][functionName] as TQuery)(
      ...[...args],
    ) as GenericQueryReturn<TQueryReturn>;

    if (address) programQuery.withAddress(address);
    if (value) programQuery.withValue(value);
    if (gasLimit) programQuery.withGasLimit(gasLimit);
    if (atBlock) programQuery.atBlock(atBlock);

    return programQuery.call();
  };

  // depends on useProgram/program implementation, programId may not be available
  const programId =
    program && typeof program === 'object' && 'programId' in program ? (program.programId as HexString) : undefined;

  const queryKey = useMemo(
    () => [
      'query',
      programId,
      address,
      serviceName as string, // TODO: can we remove this cast by giving TProgram some type to extend?
      functionName as string,
      JSON.stringify(args), // stringify for types consistency, is it a good practice?
      value?.toString(),
      gasLimit?.toString(),
      atBlock,
    ],
    [programId, address, serviceName, functionName, args, value, gasLimit, atBlock],
  );

  useEffect(() => {
    if (!isApiReady || !watch) return;

    const unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data }) => {
      const changedIDs = data.stateChanges.toHuman() as HexString[];
      const isAnyChange = changedIDs.some((id) => id === programId);

      if (!isAnyChange) return;

      void queryClient.invalidateQueries({ queryKey });
    });

    return () => {
      void unsub.then((unsubCallback) => unsubCallback());
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
