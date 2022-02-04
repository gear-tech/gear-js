import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { Vec } from '@polkadot/types';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { useApi } from 'hooks/useApi';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { Summary } from './children/Summary/Summary';
import { Main } from './children/Main/Main';
import styles from './Block.module.scss';

type Props = {
  blockId: string;
};

const Block = ({ blockId }: Props) => {
  const [api] = useApi();
  const [block, setBlock] = useState<DotBlock>();
  const [eventRecords, setEventRecords] = useState<Vec<FrameSystemEventRecord>>();

  useEffect(() => {
    if (api && blockId) {
      const isBlockHash = isHex(blockId);
      const id = isBlockHash ? (blockId as `0x${string}`) : Number(blockId);

      // FIXME: remove after eslint config upgrade
      // eslint-disable-next-line @typescript-eslint/no-shadow
      api.blocks.get(id).then(({ block }) => {
        api.blocks.getEvents(block.hash).then(setEventRecords);
        setBlock(block);
      });
    }
  }, [api, blockId]);

  return (
    <div className={styles.block}>
      {block && eventRecords ? (
        <>
          <Summary block={block} />
          <Main extrinsics={block.extrinsics} eventRecords={eventRecords} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export { Block };
