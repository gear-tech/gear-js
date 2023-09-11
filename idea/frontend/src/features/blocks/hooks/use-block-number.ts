import { HexString } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

function useBlockNumber(blockHash: HexString | undefined) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [blockNumber, setBlockNumber] = useState('');

  useEffect(() => {
    setBlockNumber('');

    if (!isApiReady || !blockHash) return;

    api.blocks
      .getBlockNumber(blockHash)
      .then((result) => setBlockNumber(result.toString()))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, blockHash]);

  return { blockNumber };
}

export { useBlockNumber };
