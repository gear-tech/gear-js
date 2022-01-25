import React from 'react';
import { EventsList } from './EventsList/EventsList';
import { ProgramSwitch } from 'components/blocks/ProgramSwitch/ProgramSwitch';
import { SWITCH_PAGE_TYPES } from 'consts';
import { GroupedEventsProps } from 'types/events-list';
import styles from './Explorer.module.scss';

const Explorer = ({ groupedEvents }: GroupedEventsProps) => {
  return (
    <div className={styles.explorer}>
      <ProgramSwitch pageType={SWITCH_PAGE_TYPES.EXPLORER} />
      <EventsList groupedEvents={groupedEvents} />
    </div>
  );
};

export default Explorer;
