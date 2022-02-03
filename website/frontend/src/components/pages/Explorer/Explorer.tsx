import React from 'react';
import { useParams } from 'react-router-dom';
import { EventsProps } from 'types/explorer';
import { BackButton } from 'common/components/BackButton/BackButton';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import { Search } from './Search/Search';
import { Events } from './Events/Events';
import { Block } from './Block/Block';
import styles from './Explorer.module.scss';

type Params = {
  blockId: string | undefined;
};

const Explorer = ({ events }: EventsProps) => {
  const { blockId }: Params = useParams();

  return (
    <div className={styles.explorer}>
      <header className={styles.header}>
        <BackButton />
        <Search />
        <BlocksSummary />
      </header>
      {blockId ? <Block blockId={blockId} /> : <Events events={events} />}
    </div>
  );
};

export default Explorer;
