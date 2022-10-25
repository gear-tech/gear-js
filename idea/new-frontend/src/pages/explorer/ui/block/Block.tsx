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
  const isError = !!error;

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
        .catch(({ message }: Error) => setError(message));
    }
  }, [api, blockId]);

  return (
    <div className={styles.block}>
      <Summary block={block} isError={isError} />
      <MainTable extrinsics={block?.extrinsics} eventRecords={eventRecords} error={error} />
      <System eventRecords={eventRecords} isError={isError} />
    </div>
  );
};

export { Block };
