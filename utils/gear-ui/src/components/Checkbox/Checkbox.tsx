import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'switch';
}

const Checkbox = forwardRef(({ label, className, type, ...attrs }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');
  const inputClassName = clsx(styles.input, type === 'switch' ? styles.switch : styles.checkbox);

  return (
    <label className={labelClassName}>
      <input type="checkbox" className={inputClassName} ref={ref} {...attrs} />
      {label}
    </label>
  );
});

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Checkbox, styles as checkboxStyles };
export type { Props as CheckboxProps };
