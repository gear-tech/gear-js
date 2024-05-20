import { useQuery } from '@tanstack/react-query';

import rmrkCatalogUrl from '../assets/rmrk-catalog.idl?url';
import rmrkResourceUrl from '../assets/rmrk-resource.idl?url';

function useIdl(isCatalog?: boolean) {
  const { data } = useQuery({
    queryKey: ['idl', isCatalog],
    queryFn: async () => {
      const response = await fetch(isCatalog ? rmrkCatalogUrl : rmrkResourceUrl);
      const idl = await response.text();

      return idl;
    },
  });

  return data;
}

export { useIdl };
