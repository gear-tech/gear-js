import React from 'react';
import { EventRecords } from 'types/explorer';
import { Event } from '../Event/Event';
import styles from './System.module.scss';

type Props = {
  eventRecords: EventRecords;
};

const System = ({ eventRecords }: Props) => {
  const systemEvents = eventRecords.filter(({ phase }) => !phase.isApplyExtrinsic).map(({ event }) => event);
  const isAnyEvent = systemEvents.length > 0;

  const getEvents = () => systemEvents.map((event, index) => <Event key={index} event={event} />);

  return (
    <div className={styles.system}>
      <div className={styles.header}>System events</div>
      {isAnyEvent ? <ul>{getEvents()}</ul> : <p className={styles.message}>No events available.</p>}
    </div>
  );
};

export { System };
