import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';

import { useChain } from '@/hooks';

function useLocalCode(id: HexString) {
  const { isDevChain } = useChain();
  const { api, isApiReady } = useApi();

  // TODO: useMetadataHash hook or util?
  const getMetadataHash = async () => {
    if (!isApiReady) throw new Error('API is not initialized');

    try {
      return api.code.metaHash(id);
    } catch (error) {
      return null;
    }
  };

  const getCode = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!isDevChain) throw new Error('For indexed nodes use appropriate storage request');

    const name = id;
    const metahash = await getMetadataHash();

    return { id, name, metahash };
  };

  return useQuery({
    queryKey: ['local-code', id],
    queryFn: getCode,
    enabled: isApiReady && isDevChain,
  });
}

export { useLocalCode };
