import { useQuery } from '@tanstack/react-query';

import { createSailsParser } from './parse-idl';

function useSailsInit() {
  const { data } = useQuery({
    queryKey: ['sails'],

    queryFn: createSailsParser,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  return data;
}

export { useSailsInit };
