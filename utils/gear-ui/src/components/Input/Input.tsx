import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Icon, Text } from './children';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

const Input = ({ label, icon, className, ...attrs }: InputProps) => {
  const { readOnly, disabled } = attrs;
  const labelClassName = clsx(styles.label, disabled && 'disabled', className);
  const wrapperClassName = clsx(styles.wrapper, readOnly && styles.readOnly);

  return (
    <label className={labelClassName} data-testid="label">
      {label && <Text txt={label} />}
      <div className={wrapperClassName} data-testid="wrapper">
        {icon && <Icon src={icon} />}
        <input className={styles.input} {...attrs} />
      </div>
    </label>
  );
};

export { Input, InputProps };
