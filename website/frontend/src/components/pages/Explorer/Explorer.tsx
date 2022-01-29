import React from 'react';
import { useHistory } from 'react-router-dom';
import { EventsList } from './EventsList/EventsList';
import { EventsProps } from 'types/events-list';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import Arrow from 'assets/images/arrow_back.svg';
import styles from './Explorer.module.scss';

const Explorer = ({ events }: EventsProps) => {
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
        <BlocksSummary />
      </header>
      <EventsList events={events} />
    </div>
  );
};

export default Explorer;
