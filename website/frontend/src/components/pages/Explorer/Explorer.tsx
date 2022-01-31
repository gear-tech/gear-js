import React from 'react';
import { useHistory } from 'react-router-dom';
import { EventsList } from './EventsList/EventsList';
import { ProgramSwitch } from 'components/blocks/ProgramSwitch/ProgramSwitch';
import { SWITCH_PAGE_TYPES } from 'consts';
import { GroupedEventsProps } from 'types/events-list';
import Arrow from 'assets/images/arrow_back.svg';
import styles from './Explorer.module.scss';

const Explorer = ({ groupedEvents }: GroupedEventsProps) => {
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <div className={styles.explorer}>
      <header className={styles.header}>
        <button type="button" aria-label="go back" className="img-wrapper" onClick={handleBackButtonClick}>
          <img src={Arrow} alt="back arrow" />
        </button>
        <ProgramSwitch pageType={SWITCH_PAGE_TYPES.EXPLORER} />
      </header>
      <EventsList groupedEvents={groupedEvents} />
    </div>
  );
};

export default Explorer;
