import React, { useEffect, useState } from 'react';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { EventRecords } from 'types/explorer';
import { useApi } from 'hooks/useApi';
import { isHex } from 'helpers';
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
  const [error, setError] = useState('');

  const resetState = () => {
    setBlock(undefined);
    setEventRecords(undefined);
    setError('');
  };

  useEffect(() => {
    if (api) {
      resetState();

      const isBlockHash = isHex(blockId);
      const id = isBlockHash ? (blockId as `0x${string}`) : Number(blockId);

      api.blocks
        .get(id)
        .then(({ block: newBlock }) => {
          api.blocks.getEvents(newBlock.hash).then(setEventRecords);
          setBlock(newBlock);
        })
        .catch(({ message }: Error) => {
          setError(message);
        });
    }
  }, [api, blockId]);

  if (error) {
    return <p className={styles.message}>Something went wrong. {error}</p>;
  }

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
