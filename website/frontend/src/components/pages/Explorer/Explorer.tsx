import React from 'react';
import { EventsList } from './EventsList/EventsList';
import styles from './Explorer.module.scss';

const Explorer = () => {
  return (
    <div className={styles.explorer}>
      <EventsList />
    </div>
  );
};

export default Explorer;
