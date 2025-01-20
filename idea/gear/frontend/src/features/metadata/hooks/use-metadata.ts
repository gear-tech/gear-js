import { HexString, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';

import { useChain } from '@/hooks';
import { getLocalMetadata } from '@/features/local-indexer';

import { fetchMetadata } from '../api/requests';
import { errorMessage } from '../consts';

function useMetadata(hash?: HexString | null | undefined) {
  const alert = useAlert();
  const { isDevChain } = useChain();

  // TODO: no need to store metadataHex, it's only used on metadata upload and there it's retrived from the file
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
      .catch(({ message }) => message !== errorMessage.metadataNotFound && alert.error(message))
      .finally(() => setIsMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  return { metadata, metadataHex, isMetadataReady, setMetadataHex, getMetadata };
}

export { useMetadata };
