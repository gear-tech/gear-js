import React from 'react';
import clsx from 'clsx';
import styles from './Body.module.scss';
import commonStyles from '../../EventItem.module.scss';

type Props = {
  params: string;
};

const Body = ({ params }: Props) => {
  const paramsClassName = clsx(commonStyles.text, styles.params);

  return (
    <div className={styles.body}>
      <pre className={paramsClassName}>{params}</pre>
    </div>
  );
};

export { Body };
