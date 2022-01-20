import React from 'react';
import clsx from 'clsx';
import styles from './Body.module.scss';
import commonStyles from '../../EventItem.module.scss';

type Props = {
  formattedData: string;
};

const Body = ({ formattedData }: Props) => {
  const preClassName = clsx(commonStyles.text, styles.pre);

  return (
    <div className={styles.body}>
      <pre className={preClassName}>{formattedData}</pre>
    </div>
  );
};

export { Body };
