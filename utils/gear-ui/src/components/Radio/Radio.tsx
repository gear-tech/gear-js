import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio = ({ label, className, ...attrs }: RadioProps) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  return (
    <label className={labelClassName}>
      <input type="radio" className={styles.input} {...attrs} />
      {label}
    </label>
  );
};

export { Radio, RadioProps };
