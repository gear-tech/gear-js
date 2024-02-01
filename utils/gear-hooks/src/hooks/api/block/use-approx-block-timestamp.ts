import { useCallback, useContext, useEffect, useState } from 'react';

import { AlertContext, ApiContext } from 'context';

function useGetApproxBlockTimestamp() {
  const { api, isApiReady } = useContext(ApiContext);

  const getApproxBlockTimestamp = useCallback(
    async (blockNumber: number) => {
      if (!isApiReady) throw new Error('API is not initialized');

      const { block } = await api.rpc.chain.getBlock();
      const currentBlockNumber = block.header.number.toNumber();

      const blockTime = api.consts.babe.expectedBlockTime.toNumber();

      const timeDifference = (blockNumber - currentBlockNumber) * blockTime;

      return Date.now() + timeDifference;
    },
    [isApiReady, api],
  );

  return getApproxBlockTimestamp;
}

function useApproxBlockTimestamp(blockNumber: number | undefined) {
  const { isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const getApproxBlockTimestamp = useGetApproxBlockTimestamp();

  const [blockTimestamp, setBlockTimestamp] = useState<number>();

  useEffect(() => {
    setBlockTimestamp(undefined);

    if (!isApiReady || blockNumber === undefined) return;

    getApproxBlockTimestamp(blockNumber)
      .then((result) => setBlockTimestamp(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, blockNumber]);

  return blockTimestamp === undefined
    ? { blockTimestamp, isBlockTimestampReady: false as const }
    : { blockTimestamp, isBlockTimestampReady: true as const };
}

export { useApproxBlockTimestamp, useGetApproxBlockTimestamp };
