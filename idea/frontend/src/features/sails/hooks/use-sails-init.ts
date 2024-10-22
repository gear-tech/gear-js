import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

function useSailsInit() {
  const { data } = useQuery({
    queryKey: ['sails'],

    queryFn: async () => {
      const parser = await SailsIdlParser.new();

      return new Sails(parser);
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return data;
}

export { useSailsInit };
