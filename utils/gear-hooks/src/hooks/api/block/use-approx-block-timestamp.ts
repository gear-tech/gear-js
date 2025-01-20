import { useCallback, useEffect, useState } from 'react';
import { useApi, useAlert } from 'context';
import { INumber } from '@polkadot/types/types';

function useGetApproxBlockTimestamp() {
  const { api, isApiReady } = useApi();

  const getApproxBlockTimestamp = useCallback(
    async (blockNumber: number) => {
      if (!isApiReady) throw new Error('API is not initialized');

      const { block } = await api.rpc.chain.getBlock();
      const currentBlockNumber = block.header.number.toNumber();

      const blockTime = (api.consts.babe.expectedBlockTime as INumber).toNumber();

      const timeDifference = (blockNumber - currentBlockNumber) * blockTime;

      return Date.now() + timeDifference;
    },
    [isApiReady, api],
  );

  return getApproxBlockTimestamp;
}

function useApproxBlockTimestamp(blockNumber: number | undefined) {
  const { isApiReady } = useApi();
  const alert = useAlert();

  const getApproxBlockTimestamp = useGetApproxBlockTimestamp();

  const [blockTimestamp, setBlockTimestamp] = useState<number>();

  useEffect(() => {
    setBlockTimestamp(undefined);

    if (!isApiReady || blockNumber === undefined) return;

    getApproxBlockTimestamp(blockNumber)
      .then((result) => setBlockTimestamp(result))
      .catch(({ message }: Error) => alert.error(message));
  }, [isApiReady, blockNumber]);

  return blockTimestamp === undefined
    ? { blockTimestamp, isBlockTimestampReady: false as const }
    : { blockTimestamp, isBlockTimestampReady: true as const };
}

export { useApproxBlockTimestamp, useGetApproxBlockTimestamp };
