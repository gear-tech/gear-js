import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';
import styles from './radio.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Radio = forwardRef<HTMLInputElement, Props>(({ label, className, ...attrs }, ref) => {
  const { disabled } = attrs;

  return (
    <label className={cx(styles.label, className, disabled && styles.disabled)}>
      <input type="radio" className={styles.input} ref={ref} {...attrs} />

      {label}
    </label>
  );
});

export { Radio };
export type { Props as RadioProps };
