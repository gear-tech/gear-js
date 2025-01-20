import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';

import { GetCodesParameters } from '@/features/code';
import { useChain, useErrorAlert } from '@/hooks';

function useLocalCodes(parameters: GetCodesParameters) {
  const { api, isApiReady } = useApi();
  const { isDevChain } = useChain();

  const getCodes = async () => {
    if (!isApiReady) throw new Error('API is not initialized');

    const ids = await api.code.all();
    const codes = ids.map((id) => ({ id, name: id, metahash: null }));

    const { query } = parameters;
    const result = codes.filter(({ id }) => !query || id.includes(query));
    const count = result.length;

    return { result, count };
  };

  const query = useQuery({
    queryKey: ['localCodes', parameters],
    queryFn: getCodes,
    enabled: isApiReady && isDevChain,
  });

  useErrorAlert(query.error);

  // mocking infinite query behavior for list component
  return { ...query, hasNextPage: false, fetchNextPage: () => {} };
}

export { useLocalCodes };
