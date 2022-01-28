import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { HelpCircle } from 'react-feather';
import { AddAlert } from 'store/actions/actions';
import { EventTypes } from 'types/events';
import styles from './Hint.module.scss';

type Params = {
  children: string;
};

export const Hint: FC<Params> = ({ children }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(AddAlert({ type: EventTypes.ERROR, message: `${children}` }));
  };

  return (
    <div className={styles.hint}>
      <HelpCircle className={styles.icon} size="16" onClick={handleClick} />
    </div>
  );
};
