import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { useQuery } from '@tanstack/react-query';

import { isString } from '@/shared/helpers';

const NO_METAHASH_ERROR = 'metahash function not found in exports';

function useMetadataHash(codeIdOrBuffer: HexString | Buffer | undefined) {
  const { api, isApiReady } = useApi();
  const queryKey = ['metadataHash', codeIdOrBuffer];

  const getMetadataHash = async () => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!codeIdOrBuffer) throw new Error('Code ID or buffer is not provided');

    try {
      return await (isHex(codeIdOrBuffer)
        ? api.code.metaHash(codeIdOrBuffer)
        : api.code.metaHashFromWasm(codeIdOrBuffer));
    } catch (error) {
      // mock the behavior of the meta-storage api. useMetadata hook is relying on this, maybe worth to refactor
      if (isString(error) && error === NO_METAHASH_ERROR) return null;

      throw error;
    }
  };

  const { data } = useQuery({
    queryKey,
    queryFn: getMetadataHash,
    enabled: isApiReady && Boolean(codeIdOrBuffer),
  });

  return data;
}

export { useMetadataHash };
