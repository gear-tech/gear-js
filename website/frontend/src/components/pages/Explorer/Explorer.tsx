import React from 'react';
import { EventsList } from './EventsList/EventsList';
import { EventsProps } from 'types/events-list';
import { BackButton } from 'common/components/BackButton/BackButton';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import styles from './Explorer.module.scss';

const Explorer = ({ events }: EventsProps) => {
  return (
    <div className={styles.explorer}>
      <header className={styles.header}>
        <BackButton />
        <BlocksSummary />
      </header>
      <EventsList events={events} />
    </div>
  );
};

export default Explorer;
