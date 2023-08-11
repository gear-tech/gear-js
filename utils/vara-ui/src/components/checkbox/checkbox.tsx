import { InputHTMLAttributes } from 'react';
import cx from 'clsx';
import styles from './checkbox.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type?: 'switch';
  error?: string;
};

function Checkbox({ label, className, type, error, ...attrs }: Props) {
  const { disabled } = attrs;

  return (
    <div className={styles.root}>
      <label className={cx(styles.label, className, disabled && styles.disabled)}>
        <input
          type="checkbox"
          className={cx(styles.input, type === 'switch' ? styles.switch : styles.checkbox)}
          {...attrs}
        />

        {label}
      </label>

      {error && <p className={styles.message}>{error}</p>}
    </div>
  );
}

export { Checkbox };
export type { Props as CheckboxProps };
