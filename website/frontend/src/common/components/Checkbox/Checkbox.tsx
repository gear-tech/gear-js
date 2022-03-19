import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'switch';
}

const Checkbox = ({ label, className, type, ...attrs }: Props) => {
  const labelClassName = clsx(styles.label, className);
  const inputClassName = clsx(styles.input, type === 'switch' ? styles.switch : styles.checkbox);

  return (
    <label className={labelClassName}>
      <input type="checkbox" className={inputClassName} {...attrs} />
      {label}
    </label>
  );
};

export { Checkbox };
