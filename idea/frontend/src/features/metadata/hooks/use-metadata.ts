import { HexString, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { fetchMetadata, getLocalMetadata } from 'api';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';
import { useChain } from 'hooks';

type Source = 'program' | 'code';

function useMetaHash(id: HexString | undefined, source: Source = 'program') {
  const { api } = useApi();

  const [metaHash, setMetaHash] = useState<HexString>();
  const [isMetaHashReady, setIsMetaHashReady] = useState(false);

  useEffect(() => {
    if (!id) return;

    api[source]
      .metaHash(id)
      .then((result) => setMetaHash(result))
      // eslint-disable-next-line no-console
      .catch(({ message }: Error) => console.error(message)) // if there's no meta
      .finally(() => setIsMetaHashReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { metaHash, isMetaHashReady };
}

function useMetadata(id: HexString | undefined, source: Source = 'program') {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const { metaHash, isMetaHashReady } = useMetaHash(id, source);

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [isMetadataReady, setisMetadataReady] = useState(false);

  useEffect(() => {
    if (!isMetaHashReady) return;
    if (!metaHash) return setisMetadataReady(true);

    const getMetadata = isDevChain ? getLocalMetadata : fetchMetadata;

    getMetadata({ hash: metaHash })
      .then(({ result }) => result.hex && setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message, code }: RPCError) => code !== RPCErrorCode.MetadataNotFound && alert.error(message))
      .finally(() => setisMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetaHashReady, metaHash]);

  return { metadata, isMetadataReady, setMetadata };
}

export { useMetadata };
