import { HexString, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { fetchMetadata } from 'api';

function useMetaHash(programId: HexString | undefined) {
  const { api } = useApi();

  const [metaHash, setMetaHash] = useState<HexString>();
  const [isMetaHashReady, setIsMetaHashReady] = useState(false);

  useEffect(() => {
    if (!programId) return;

    api.program
      .metaHash(programId)
      .then((result) => setMetaHash(result))
      // eslint-disable-next-line no-console
      .catch(({ message }: Error) => console.error(message))
      .finally(() => setIsMetaHashReady(true)); // if there's no meta

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  return { metaHash, isMetaHashReady };
}

function useMetadata(programId: HexString | undefined) {
  const alert = useAlert();
  const { metaHash, isMetaHashReady } = useMetaHash(programId);

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [isMetadataReady, setisMetadataReady] = useState(false);

  useEffect(() => {
    if (!isMetaHashReady) return;
    if (!metaHash) return setisMetadataReady(true);

    // TODO: local meta
    // const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

    fetchMetadata({ hash: metaHash })
      .then(({ result }) => setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setisMetadataReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetaHashReady, metaHash]);

  return { metadata, isMetadataReady };
}

export { useMetadata };
