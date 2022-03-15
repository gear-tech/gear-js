import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, className, ...attrs }: Props) => {
  const labelClassName = clsx(styles.label, className);

  return (
    <label className={labelClassName}>
      {label}
      <input type="text" {...attrs} />
    </label>
  );
};

export { Input };
