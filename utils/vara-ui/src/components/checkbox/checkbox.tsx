import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';

import styles from './checkbox.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  type?: 'switch' | 'checkbox';
  size?: 'small' | 'default';
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, className, type = 'checkbox', size = 'default', error, ...attrs }, ref) => {
    return (
      <label className={cx(styles.label, className, styles[size])}>
        <span className={styles.inputWrapper}>
          <input
            type="checkbox"
            className={cx(styles.input, styles[type])}
            ref={ref}
            aria-invalid={Boolean(error)}
            {...attrs}
          />
        </span>

        {label}
      </label>
    );
  },
);

export { Checkbox };
export type { Props as CheckboxProps };
