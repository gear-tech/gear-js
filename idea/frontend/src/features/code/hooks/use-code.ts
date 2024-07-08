import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { getCode } from '@/api';

function useCode(id: HexString) {
  return useQuery({
    queryKey: ['code', id],
    queryFn: async () => (await getCode(id)).result,
  });
}

export { useCode };
