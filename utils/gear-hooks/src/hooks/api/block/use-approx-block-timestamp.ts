import { useContext, useEffect, useState } from 'react';

import { AlertContext, ApiContext } from 'context';

const useApproxBlockTimestamp = (blockNumber: number | undefined) => {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [blockTimestamp, setBlockTimestamp] = useState<number>();
  const isBlockTimestampReady = blockTimestamp !== undefined;

  const getBlockTimestamp = async (_blockNumber: number) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { block } = await api.rpc.chain.getBlock();
    const currentBlockNumber = block.header.number.toNumber();

    const blockTime = api.consts.babe.expectedBlockTime.toNumber();

    const timeDifference = (_blockNumber - currentBlockNumber) * blockTime;

    return Date.now() + timeDifference;
  };

  useEffect(() => {
    setBlockTimestamp(undefined);

    if (!isApiReady || blockNumber === undefined) return;

    getBlockTimestamp(blockNumber)
      .then((result) => setBlockTimestamp(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, blockNumber]);

  return { blockTimestamp, isBlockTimestampReady, getBlockTimestamp };
};

export { useApproxBlockTimestamp };
