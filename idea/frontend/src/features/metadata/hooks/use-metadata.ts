import { HexString, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';

import { fetchMetadata, getLocalMetadata } from '@/api';
import { RPCError, RPCErrorCode } from '@/shared/services/rpcService';
import { useChain } from '@/hooks';

function useMetadata(hash?: HexString | null | undefined) {
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [metadataHex, setMetadataHex] = useState<HexString>();
  const metadata = useMemo(() => (metadataHex ? ProgramMetadata.from(metadataHex) : undefined), [metadataHex]);

  const defaultIsReady = hash === null;
  const [isMetadataReady, setIsMetadataReady] = useState(defaultIsReady);

  const getMetadata = (_hash: HexString) =>
    isDevChain ? getLocalMetadata(_hash).catch(() => fetchMetadata(_hash)) : fetchMetadata(_hash);

  useEffect(() => {
    setMetadataHex(undefined);
    setIsMetadataReady(defaultIsReady);

    if (!hash) return;

    getMetadata(hash)
      .then(({ result }) => result.hex && setMetadataHex(result.hex))
      .catch(({ message, code }: RPCError) => code !== RPCErrorCode.MetadataNotFound && alert.error(message))
      .finally(() => setIsMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  return { metadata, metadataHex, isMetadataReady, setMetadataHex, getMetadata };
}

export { useMetadata };
