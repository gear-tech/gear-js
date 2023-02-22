import { ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';

import { fetchCodeMetadata } from 'api';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';
import { useChain } from 'hooks';

const useMetadata = (codeId: HexString) => {
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [metadata, setMetadata] = useState<ProgramMetadata>();
  const [isMetadataReady, setIsMetadataReady] = useState(isDevChain);

  useEffect(() => {
    if (isDevChain) return;

    fetchCodeMetadata(codeId)
      .then(({ result }) => setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message, code }: RPCError) => {
        if (code !== RPCErrorCode.MetadataNotFound) alert.error(message);
      })
      .finally(() => setIsMetadataReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { metadata, isMetadataReady, updateMetadata: setMetadata };
};

export { useMetadata };
