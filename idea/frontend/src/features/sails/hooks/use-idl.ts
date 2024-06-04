import { useQuery } from '@tanstack/react-query';

import rmrkResourceUrl from '../assets/rmrk-resource.idl?url';

function useIdl(url: string = rmrkResourceUrl) {
  const { data } = useQuery({
    queryKey: ['idl', url],
    queryFn: async () => {
      const response = await fetch(url);
      const idl = await response.text();

      return idl;
    },
  });

  return data;
}

export { useIdl };
