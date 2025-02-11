import { ComponentPropsWithRef, ReactNode } from 'react';
import cx from 'clsx';

import styles from './radio.module.scss';

type Props = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  label: string;
  size?: 'small' | 'default';
  error?: ReactNode;
};

const Radio = ({ label, className, size = 'default', error, ...attrs }: Props) => {
  return (
    <label className={cx(styles.label, className, styles[size])}>
      <input type="radio" className={styles.input} aria-invalid={Boolean(error)} {...attrs} />
      <span className={styles.box} />

      {label}
    </label>
  );
};

export { Radio };
export type { Props as RadioProps };
