import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { useApi } from 'hooks/useApi';
import styles from './Block.module.scss';

type Props = {
  blockId: string;
};

const Block = ({ blockId }: Props) => {
  const [api] = useApi();
  const [block, setBlock] = useState<DotBlock>();

  useEffect(() => {
    if (api && blockId) {
      const isBlockHash = isHex(blockId);
      const id = isBlockHash ? (blockId as `0x${string}`) : Number(blockId);

      // FIXME: remove after eslint config upgrade
      // eslint-disable-next-line @typescript-eslint/no-shadow
      api.blocks.get(id).then(({ block }) => {
        setBlock(block);
      });
    }
  }, [api, blockId]);

  return <div></div>;
};

export { Block };
