import React, { FC } from 'react';
import { Loader } from 'react-feather';
import styles from './ComponentLoader.module.scss';

type Props = {
  color?: string;
};

export const ComponentLoader: FC<Props> = ({ color = '#fff' }) => {
  return <Loader color={color} className={styles.loader} />;
};
