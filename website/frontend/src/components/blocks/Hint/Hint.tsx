import React, { FC } from 'react';
import { HelpCircle } from 'react-feather';
import { AlertTypes } from 'types/alerts';
import styles from './Hint.module.scss';
import { useAlert } from 'react-alert';

type Params = {
  children: string;
};

export const Hint: FC<Params> = ({ children }) => {
  const alert = useAlert();

  const handleClick = () => {
    alert.show(`${children}`, { type: AlertTypes.ERROR });
  };

  return (
    <div className={styles.hint}>
      <HelpCircle className={styles.icon} size="16" onClick={handleClick} />
    </div>
  );
};
