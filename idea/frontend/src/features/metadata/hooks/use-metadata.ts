import { HexString, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { fetchMetadata, getLocalMetadata } from 'api';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';
import { useChain } from 'hooks';

function useMetadata(hash?: HexString | null | undefined) {
  const alert = useAlert();

  const { isDevChain } = useChain();

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [isMetadataReady, setIsMetadataReady] = useState(false);

  const getMetadata = (params: { hash: HexString }) =>
    isDevChain ? getLocalMetadata(params).catch(() => fetchMetadata(params)) : fetchMetadata(params);

  useEffect(() => {
    if (hash === null) return setIsMetadataReady(true);
    if (!hash) return;

    getMetadata({ hash })
      .then(({ result }) => result.hex && setMetadata(ProgramMetadata.from(result.hex)))
      .catch(({ message, code }: RPCError) => code !== RPCErrorCode.MetadataNotFound && alert.error(message))
      .finally(() => setIsMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  return { metadata, isMetadataReady, setMetadata, getMetadata };
}

export { useMetadata };
