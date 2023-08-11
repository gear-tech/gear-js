import { InputHTMLAttributes } from 'react';
import cx from 'clsx';
import styles from './radio.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Radio({ label, className, ...attrs }: Props) {
  const { disabled } = attrs;

  return (
    <label className={cx(styles.label, className, disabled && styles.disabled)}>
      <input type="radio" className={styles.input} {...attrs} />

      {label}
    </label>
  );
}

export { Radio };
export type { Props as RadioProps };
