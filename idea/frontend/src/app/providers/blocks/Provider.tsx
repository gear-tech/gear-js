import { ReactNode, useState, useEffect } from 'react';
import { useApi } from '@gear-js/react-hooks';

import { IChainBlock } from 'entities/chainBlock';

import { BlocksContext } from './Context';
import { getTime, getBlock } from './helpers';

type Props = {
  children: ReactNode;
};

const BlocksProvider = ({ children }: Props) => {
  const { api, isApiReady } = useApi();
  const [blocks, setBlocks] = useState<IChainBlock[]>([]);

  const updateBlocks = (block: IChainBlock) =>
    setBlocks((prevBlocks) => {
      const blocksTail = prevBlocks.length > 9 ? prevBlocks.slice(0, -1) : prevBlocks;

      return [block, ...blocksTail];
    });

  useEffect(() => {
    if (!isApiReady) return;

    const unsub = api.blocks.subscribeNewHeads((header) =>
      api.blocks
        .getBlockTimestamp(header.hash)
        .then((timestamp) => getTime(timestamp.toNumber()))
        .then((time) => getBlock(header, time))
        .then((result) => updateBlocks(result)),
    );

    return () => {
      unsub.then((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return <BlocksContext.Provider value={blocks}>{children}</BlocksContext.Provider>;
};

export { BlocksProvider };
