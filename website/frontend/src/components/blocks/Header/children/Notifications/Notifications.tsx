import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { RootState } from 'store/reducers';
import Bell from 'assets/images/bell.svg';
import styles from './Notifications.module.scss';
import Counter from './Counter/Counter';

const Notifications = () => {
  // TOFIX: countUnread type to be number not number | null;
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  const unreadAmount = Number(countUnread);
  const isAnyNotification = unreadAmount > 0;

  return (
    <Link to={routes.notifications} className={`img-wrapper ${styles.notifications}`}>
      {isAnyNotification && <Counter value={unreadAmount} />}
      <img src={Bell} alt="notifications" className={styles.icon} />
    </Link>
  );
};

export default Notifications;
