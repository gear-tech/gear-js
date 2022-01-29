import React, { FC } from 'react';
import { Loader } from 'react-feather';
import styles from './ComponentLoader.module.scss';

export const ComponentLoader: FC = () => {
  return <Loader color="#fff" className={styles.loader} />;
};
