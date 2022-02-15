import React, { FC } from 'react';
import { Loader } from 'react-feather';
import styles from './Spinner.module.scss';

type Props = {
  color?: string;
};

export const Spinner: FC<Props> = ({ color = '#fff' }) => {
  return <Loader color={color} className={styles.loader} />;
};
