import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { useChain, useErrorAlert } from '@/hooks';

import { getCode } from '../requests';

function useCode(id: HexString) {
  const { isDevChain } = useChain();

  const query = useQuery({
    queryKey: ['code', id],
    queryFn: async () => (await getCode(id)).result,
    enabled: !isDevChain,
  });

  useErrorAlert(query.error);

  return query;
}

export { useCode };
