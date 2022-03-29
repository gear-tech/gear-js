import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'switch';
}

const Checkbox = ({ label, className, type, ...attrs }: CheckboxProps) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');
  const inputClassName = clsx(styles.input, type === 'switch' ? styles.switch : styles.checkbox);

  return (
    <label className={labelClassName}>
      <input type="checkbox" className={inputClassName} {...attrs} />
      {label}
    </label>
  );
};

export { Checkbox, CheckboxProps };
