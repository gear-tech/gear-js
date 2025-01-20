import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { useLocalProgram } from '@/features/local-indexer';
import { useChain, useErrorAlert } from '@/hooks';

import { getProgram } from '../requests';

function useProgram(id: HexString | undefined) {
  // TODO: separate into shandalone hook
  const { isDevChain } = useChain();
  const { getLocalProgramRequest } = useLocalProgram();

  const query = useQuery({
    queryKey: ['program', id, isDevChain],
    queryFn: async () => (await (isDevChain ? getLocalProgramRequest : getProgram)(id!)).result,
    enabled: Boolean(id),
  });

  useErrorAlert(query.error);

  return query;
}

export { useProgram };
