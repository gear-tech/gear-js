import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio = ({ label, className, ...attrs }: Props) => {
  const labelClassName = clsx(styles.label, className);

  return (
    <label className={labelClassName}>
      <input type="radio" className={styles.input} {...attrs} />
      {label}
    </label>
  );
};

export { Radio };
