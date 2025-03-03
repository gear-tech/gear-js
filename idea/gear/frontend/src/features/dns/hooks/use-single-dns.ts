import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';

import { getSingleDns } from '../utils';

function useSingleDns(address: HexString) {
  const { api, isApiReady } = useApi();

  const getQuery = () => {
    if (!isApiReady) throw new Error('Genesis hash is not found');
    const genesis = api.genesisHash.toHex();

    return getSingleDns({ address, genesis });
  };

  return useQuery({
    queryKey: ['single-dns', address],
    queryFn: getQuery,
    enabled: Boolean(isApiReady),
  });
}

export { useSingleDns };
