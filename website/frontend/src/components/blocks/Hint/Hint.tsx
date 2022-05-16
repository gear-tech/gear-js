import React, { FC } from 'react';
import { useAlert } from 'hooks';
import { HelpCircle } from 'react-feather';
import styles from './Hint.module.scss';

type Params = {
  children: string;
};

export const Hint: FC<Params> = ({ children }) => {
  const alert = useAlert();

  const handleClick = () => {
    alert.error(`${children}`);
  };

  return (
    <div className={styles.hint}>
      <HelpCircle className={styles.icon} size="16" onClick={handleClick} />
    </div>
  );
};
