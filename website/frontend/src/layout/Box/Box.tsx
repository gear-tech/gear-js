import React from 'react';
import styles from './Box.module.scss';

type Props = {
  children: React.ReactNode;
};

const Box = ({ children }: Props) => <div className={styles.box}>{children}</div>;

export default Box;
