import { useApi } from '@gear-js/react-hooks';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { isHex } from '@polkadot/util';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { EventRecords } from '../../types';
import { MainTable } from '../main-table';
import { Summary } from '../summary';
import { System } from '../system';

import styles from './block.module.scss';

type Params = {
  blockId: string;
};

const Block = () => {
  const { api, isApiReady } = useApi();

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
    if (!isApiReady) return;

    resetState();

    const id = isHex(blockId) ? blockId : Number(blockId);

    api.blocks
      .get(id)
      .then((result) => {
        api.blocks.getEvents(result.block.hash).then((recordsResult) => setEventRecords(recordsResult));
        setBlock(result.block);
      })
      .catch(({ message }: Error) => setError(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, blockId]);

  return (
    <div className={styles.block}>
      <Summary block={block} isError={isError} />
      <MainTable extrinsics={block?.extrinsics} eventRecords={eventRecords} error={error} />
      <System eventRecords={eventRecords} isError={isError} />
    </div>
  );
};

export { Block };
