import { useState } from 'react';
import { Header } from '@polkadot/types/interfaces';
import { useApi } from '@gear-js/react-hooks';

import { Props } from '../types';
import { BlocksContext } from './Context';
import { Block, Blocks } from './types';

import { useSubscription } from 'hooks';

const { Provider } = BlocksContext;

const useBlocks = () => {
  const { api } = useApi();
  const [blocks, setBlocks] = useState<Blocks>([]);

  const getTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

  const getBlock = ({ hash, number }: Header, time: string) => ({
    hash: hash.toHex(),
    number: number.toNumber(),
    time,
  });

  const updateBlocks = (block: Block) => {
    setBlocks((prevBlocks) => {
      const blocksTail = prevBlocks.length > 9 ? prevBlocks.slice(0, -1) : prevBlocks;
      return [block, ...blocksTail];
    });
  };

  const handleSubscription = (header: Header) =>
    api.blocks
      .getBlockTimestamp(header.hash)
      .then((timestamp) => getTime(timestamp.toNumber()))
      .then((time) => getBlock(header, time))
      .then(updateBlocks);

  const subscribeToBlocks = () => api.gearEvents.subscribeToNewBlocks(handleSubscription);
  useSubscription(subscribeToBlocks);

  return blocks;
};

const BlocksProvider = ({ children }: Props) => <Provider value={useBlocks()}>{children}</Provider>;

export { BlocksProvider };
