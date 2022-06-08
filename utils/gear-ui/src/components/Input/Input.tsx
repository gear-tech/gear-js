import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

const Input = forwardRef(({ label, icon, className, ...attrs }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { readOnly, disabled } = attrs;
  const labelClassName = clsx(styles.label, disabled && 'disabled', className);
  const wrapperClassName = clsx(styles.wrapper, readOnly && styles.readOnly);

  return (
    <label className={labelClassName} data-testid="label">
      {label && <span className={styles.text}>{label}</span>}
      <div className={wrapperClassName} data-testid="wrapper">
        {icon && <img src={icon} alt="input icon" className={styles.icon} />}
        <input className={styles.input} ref={ref} {...attrs} />
      </div>
    </label>
  );
});

export { Input, Props as InputProps, styles as inputStyles };
