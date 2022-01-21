import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from 'routes';
import { RootState } from 'store/reducers';
import Bell from 'assets/images/bell.svg';
import { Counter } from './Counter/Counter';
import styles from './Notifications.module.scss';

const Notifications = () => {
  // TOFIX: countUnread type to be number not number | null;
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  const unreadAmount = Number(countUnread);
  const isAnyNotification = unreadAmount > 0;
  const className = clsx('img-wrapper', styles.notifications);

  return (
    <Link to={routes.notifications} className={className}>
      {isAnyNotification && <Counter value={unreadAmount} />}
      <img src={Bell} alt="notifications" />
    </Link>
  );
};

export { Notifications };
