import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';
import styles from './checkbox.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type?: 'switch';
};

const Checkbox = forwardRef<HTMLInputElement, Props>(({ label, className, type, ...attrs }, ref) => {
  const { disabled } = attrs;

  return (
    <label className={cx(styles.label, className, disabled && styles.disabled)}>
      <input
        type="checkbox"
        className={cx(styles.input, type === 'switch' ? styles.switch : styles.checkbox)}
        ref={ref}
        {...attrs}
      />

      {label}
    </label>
  );
});

export { Checkbox };
export type { Props as CheckboxProps };
