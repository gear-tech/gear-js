import React from 'react';
import { Events } from './Events/Events';
import { EventsProps } from 'types/explorer';
import { BackButton } from 'common/components/BackButton/BackButton';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import { Search } from './Search/Search';
import styles from './Explorer.module.scss';

const Explorer = ({ events }: EventsProps) => {
  return (
    <div className={styles.explorer}>
      <header className={styles.header}>
        <BackButton />
        <Search />
        <BlocksSummary />
      </header>
      <Events events={events} />
    </div>
  );
};

export default Explorer;
