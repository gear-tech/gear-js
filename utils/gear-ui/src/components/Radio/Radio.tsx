import { InputHTMLAttributes, forwardRef, ForwardedRef } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio = forwardRef(({ label, className, ...attrs }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  return (
    <label className={labelClassName}>
      <input type="radio" className={styles.input} ref={ref} {...attrs} />
      {label}
    </label>
  );
});

export { Radio, styles as radioStyles };
export type { Props as RadioProps };
