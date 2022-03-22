import React from 'react';
import clsx from 'clsx';
import { Props } from './types';
import styles from './Radio.module.scss';

const Radio = ({ label, className, ...attrs }: Props) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  return (
    <label className={labelClassName}>
      <input type="radio" className={styles.input} {...attrs} />
      {label}
    </label>
  );
};

export { Radio };
