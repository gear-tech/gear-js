import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Block as DotBlock } from '@polkadot/types/interfaces';
import { useApi } from '@gear-js/react-hooks';

import styles from './ExplorerBlock.module.scss';
import { Params } from './types';
import { Summary } from './children/Summary/Summary';
import { MainTable } from './children/MainTable/MainTable';
import { System } from './children/System/System';

import { isHex } from 'helpers';
import { EventRecords } from 'types/explorer';
import { Spinner } from 'components/common/Spinner/Spinner';

const ExplorerBlock = () => {
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

export { ExplorerBlock };
