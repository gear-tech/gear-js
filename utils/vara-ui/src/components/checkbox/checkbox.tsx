import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';
import styles from './checkbox.module.scss';
import type { ICheckboxSizes, ICheckboxTypes } from './helpers.ts';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type?: ICheckboxTypes;
  checkboxSize?: ICheckboxSizes;
  hasError?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, className, type = 'checkbox', checkboxSize = 'md', hasError, ...attrs }, ref) => {
    const { disabled } = attrs;

    return (
      <label
        className={cx(
          styles.label,
          className,
          hasError && styles.error,
          disabled && styles.disabled,
          styles[checkboxSize],
        )}
        aria-invalid={hasError}>
        <input type="checkbox" className={cx(styles.input, styles[type])} ref={ref} {...attrs} />

        {label}
      </label>
    );
  },
);

export { Checkbox };
export type { Props as CheckboxProps };
