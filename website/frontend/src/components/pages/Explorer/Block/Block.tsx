import React, { useEffect, useState } from 'react';
import { isHex } from '@polkadot/util';
import { Block as DotBlock, Event as DotEvent } from '@polkadot/types/interfaces';
import { useApi } from 'hooks/useApi';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { Summary } from './children/Summary/Summary';
import { Events } from './children/Events/Events';
import styles from './Block.module.scss';

type Props = {
  blockId: string;
};

const Block = ({ blockId }: Props) => {
  const [api] = useApi();
  const [block, setBlock] = useState<DotBlock>();
  const [events, setEvents] = useState<DotEvent[]>([]);

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

  useEffect(() => {
    if (api && block) {
      const { hash } = block;
      api.blocks.getEvents(hash).then((eventRecords) => {
        // extract events using getEvents from util?
        const newEvents = eventRecords.map(({ event }) => event);
        setEvents(newEvents);
      });
    }
  }, [api, block]);

  return (
    <div className={styles.block}>
      {block ? (
        <>
          <Summary block={block} />
          <Events events={events} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export { Block };
