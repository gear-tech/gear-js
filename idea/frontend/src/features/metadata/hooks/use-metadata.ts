import { HexString, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { fetchMetadata } from 'api';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';

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
  const { metaHash, isMetaHashReady } = useMetaHash(id, source);

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [isMetadataReady, setisMetadataReady] = useState(false);

  useEffect(() => {
    if (!isMetaHashReady) return;
    if (!metaHash) return setisMetadataReady(true);

    // TODO: local meta
    // const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

    fetchMetadata({ hash: metaHash })
      .then(({ result }) => result.hex && setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message, code }: RPCError) => code !== RPCErrorCode.MetadataNotFound && alert.error(message))
      .finally(() => setisMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetaHashReady, metaHash]);

  return { metadata, isMetadataReady, setMetadata };
}

export { useMetadata };
