import { useQuery } from '@tanstack/react-query';

import rmrkCatalogUrl from '../assets/rmrk-catalog.idl?url';
import rmrkResourceUrl from '../assets/rmrk-resource.idl?url';

function useIdl() {
  const { data } = useQuery({
    queryKey: ['idl'],
    queryFn: async () => {
      const response = await fetch(rmrkResourceUrl);
      const idl = await response.text();

      return idl;
    },
  });

  return data;
}

export { useIdl };
