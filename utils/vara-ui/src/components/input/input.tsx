import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import cx from 'clsx';
import styles from './input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> & {
  size?: 'default' | 'small';
  label?: string;
  error?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, label, error, type = 'text', placeholder = ' ', size = 'default', ...attrs }, ref) => {
    const { disabled } = attrs;

    const id = useId();

    return (
      <div className={cx(styles.root, className, disabled && styles.disabled)}>
        <div className={styles.base}>
          <input
            type={type}
            id={id}
            className={cx(styles.input, styles[size], error && styles.error)}
            placeholder={placeholder}
            ref={ref}
            {...attrs}
          />

          {label && (
            <label htmlFor={id} className={cx(styles.label, styles[size])}>
              {label}
            </label>
          )}

          <fieldset className={styles.fieldset}>
            <legend className={cx(styles.legend, label && styles.legendLabel)}>{label}&#8203;</legend>
          </fieldset>
        </div>

        {error && <p className={styles.message}>{error}</p>}
      </div>
    );
  },
);

export { Input };
export type { Props as InputProps };
