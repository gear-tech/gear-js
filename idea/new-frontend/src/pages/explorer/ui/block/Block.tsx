import { useApi } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { EventRecords } from 'entities/explorer';

import { Summary } from '../summary';
import { MainTable } from '../mainTable';
import { System } from '../system';
import styles from './Block.module.scss';

type Params = { blockId: string };

const Block = () => {
  const { api } = useApi();

  const { blockId } = useParams() as Params;

  const [error, setError] = useState('');
  const [block, setBlock] = useState<DotBlock>();
  const [eventRecords, setEventRecords] = useState<EventRecords>();

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

  if (error) return <p className={styles.message}>Something went wrong. {error}</p>;

  const isLoading = !block || !eventRecords;

  return (
    <div className={styles.block}>
      <Summary block={block} isLoading={isLoading} />
      <MainTable extrinsics={block?.extrinsics} eventRecords={eventRecords} isLoading={isLoading} />
      <System eventRecords={eventRecords} isLoading={isLoading} />
    </div>
  );
};

export { Block };
