import { ReactNode, useState, useEffect } from 'react';
import { Header } from '@polkadot/types/interfaces';
import { useApi } from '@gear-js/react-hooks';

import { ChainBlock } from 'entities/chainBlock';

import { BlocksContext } from './Context';
import { getTime, getBlock } from './helpers';

type Props = {
  children: ReactNode;
};

const BlocksProvider = ({ children }: Props) => {
  const { api } = useApi();
  const [blocks, setBlocks] = useState<ChainBlock[]>([]);

  const updateBlocks = (block: ChainBlock) =>
    setBlocks((prevBlocks) => {
      const blocksTail = prevBlocks.length > 9 ? prevBlocks.slice(0, -1) : prevBlocks;

      return [block, ...blocksTail];
    });

  const handleSubscription = (header: Header) =>
    api.blocks
      .getBlockTimestamp(header.hash)
      .then((timestamp) => getTime(timestamp.toNumber()))
      .then((time) => getBlock(header, time))
      .then(updateBlocks);

  useEffect(() => {
    if (!api) {
      return;
    }

    const unsub = api.gearEvents.subscribeToNewBlocks(handleSubscription);

    return () => {
      unsub.then((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  return <BlocksContext.Provider value={blocks}>{children}</BlocksContext.Provider>;
};

export { BlocksProvider };
