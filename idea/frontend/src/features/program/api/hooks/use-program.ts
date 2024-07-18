import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { useErrorAlert } from '@/hooks';

import { getProgram } from '../requests';

function useProgram(id: HexString | undefined) {
  const query = useQuery({
    queryKey: ['program', id],
    queryFn: async () => (await getProgram(id!)).result,
    enabled: Boolean(id),
  });

  useErrorAlert(query.error);

  return query;
}

export { useProgram };
