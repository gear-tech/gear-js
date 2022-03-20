import React, { ReactNode } from 'react';
import styles from './Box.module.scss';

type Props = {
  children: ReactNode;
};

const Box = ({ children }: Props) => <div className={styles.box}>{children}</div>;

export { Box };
