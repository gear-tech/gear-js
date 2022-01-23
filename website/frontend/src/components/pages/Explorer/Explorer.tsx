import React from 'react';
import { EventsList } from './EventsList/EventsList';
import { ProgramSwitch } from 'components/blocks/ProgramSwitch/ProgramSwitch';
import { SWITCH_PAGE_TYPES } from 'consts';
import styles from './Explorer.module.scss';

const Explorer = () => {
  return (
    <div className={styles.explorer}>
      <ProgramSwitch pageType={SWITCH_PAGE_TYPES.EXPLORER} />
      <EventsList />
    </div>
  );
};

export default Explorer;
