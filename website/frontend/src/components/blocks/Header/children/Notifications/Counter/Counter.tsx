import React from 'react';
import styles from './Counter.module.scss';

type Props = {
  value: number;
};

const Counter = ({ value }: Props) => <div className={styles.counter}>{value}</div>;

export { Counter };
