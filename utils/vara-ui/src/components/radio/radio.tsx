import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';
import styles from './radio.module.scss';
import type { IRadioSizes } from './helpers.ts';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  size: IRadioSizes;
};

const Radio = forwardRef<HTMLInputElement, Props>(({ label, className, size, ...attrs }, ref) => {
  const { disabled } = attrs;

  return (
    <label className={cx(styles.label, styles[size], className, disabled && styles.disabled)}>
      <span className={styles.wrapper}>
        <input type="radio" className={styles.input} ref={ref} disabled={disabled} {...attrs} />
      </span>

      {label}
    </label>
  );
});

export { Radio };
export type { Props as RadioProps };
