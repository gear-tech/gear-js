import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { EventRecords } from 'types/explorer';
import { useApi } from 'hooks/useApi';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { Summary } from './children/Summary/Summary';
import { MainTable } from './children/MainTable/MainTable';
import { System } from './children/System/System';
import styles from './Block.module.scss';

type Props = {
  blockId: string;
};

const Block = ({ blockId }: Props) => {
  const [api] = useApi();
  const [block, setBlock] = useState<DotBlock>();
  const [eventRecords, setEventRecords] = useState<EventRecords>();

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
          <MainTable extrinsics={block.extrinsics} eventRecords={eventRecords} />
          <System eventRecords={eventRecords} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export { Block };
