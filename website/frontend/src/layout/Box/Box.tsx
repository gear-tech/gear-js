import React, { FC } from 'react';
import styles from './Box.module.scss';

type Props = {
  children: React.ReactNode;
};

export const Box: FC<Props> = ({ children }) => {
  return (
    <div className="wrapper">
      <div className={styles.box}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
