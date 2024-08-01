import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';

function useSailsInit() {
  const { data } = useQuery({
    queryKey: ['sails'],
    queryFn: () => Sails.new(),
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
