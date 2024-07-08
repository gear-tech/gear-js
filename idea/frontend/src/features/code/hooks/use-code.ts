import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { getCode } from '@/api';
import { useChain } from '@/hooks';

function useCode(id: HexString) {
  const { isDevChain } = useChain();

  return useQuery({
    queryKey: ['code', id],
    queryFn: async () => (await getCode(id)).result,
    enabled: !isDevChain,
  });
}

export { useCode };
