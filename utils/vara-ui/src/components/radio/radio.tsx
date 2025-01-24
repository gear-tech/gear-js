import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import cx from 'clsx';

import styles from './radio.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  size?: 'small' | 'default';
  error?: ReactNode;
};

const Radio = forwardRef<HTMLInputElement, Props>(({ label, className, size = 'default', error, ...attrs }, ref) => {
  return (
    <label className={cx(styles.label, className, styles[size])}>
      <input type="radio" className={styles.input} ref={ref} aria-invalid={Boolean(error)} {...attrs} />
      <span className={styles.box} />

      {label}
    </label>
  );
});

export { Radio };
export type { Props as RadioProps };
