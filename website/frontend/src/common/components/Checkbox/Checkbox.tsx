import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, className, ...attrs }: Props) => {
  const labelClassName = clsx(styles.label, className);

  return (
    <label className={labelClassName}>
      <input type="checkbox" className={styles.input} {...attrs} />
      {label}
    </label>
  );
};

export { Checkbox };
