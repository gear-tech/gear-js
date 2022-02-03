import React from 'react';
import { Event as DotEvent } from '@polkadot/types/interfaces';
import { Event } from './Event/Event';
import commonStyles from '../../Block.module.scss';
import styles from './Events.module.scss';

type Props = {
  events: DotEvent[];
};

const Events = ({ events }: Props) => {
  const isAnyEvent = events.length > 0;

  // replace key
  const getEvents = () => events.map((event, index) => <Event key={index} event={event} />);

  return (
    <div className={styles.events}>
      <header className={commonStyles.header}>Events</header>
      {isAnyEvent ? (
        <ul className={styles.body}>{getEvents()}</ul>
      ) : (
        <p className={commonStyles.message}>No events available.</p>
      )}
    </div>
  );
};

export { Events };
