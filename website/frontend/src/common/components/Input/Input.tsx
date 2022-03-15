import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

const Input = ({ label, icon, className, ...attrs }: Props) => {
  const { readOnly } = attrs;

  const labelClassName = clsx(styles.label, className);
  const wrapperClassName = clsx(styles.wrapper, readOnly && styles.readOnly);

  return (
    <label className={labelClassName}>
      {label}
      <div className={wrapperClassName} data-testid="wrapper">
        {icon && <img src={icon} alt="input icon" className={styles.icon} />}
        <input className={styles.input} {...attrs} />
      </div>
    </label>
  );
};

export { Input };
