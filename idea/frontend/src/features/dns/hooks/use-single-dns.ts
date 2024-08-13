import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { getSingleDns } from '../utils';

function useSingleDns(address: HexString) {
  return useQuery({
    queryKey: ['single-dns', address],
    queryFn: () => getSingleDns({ address }),
  });
}

export { useSingleDns };
