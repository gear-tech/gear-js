import cx from 'clsx';
import { ComponentPropsWithRef, ReactNode } from 'react';

import styles from './radio.module.scss';

type Props = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  label: string;
  size?: 'small' | 'default';
  error?: ReactNode;
};

const Radio = ({ label, className, size = 'default', error, ...attrs }: Props) => {
  return (
    <label className={cx(styles.label, className, styles[size])}>
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- TODO(#1810): resolve eslint comments */}
      <input type="radio" className={styles.input} aria-invalid={Boolean(error)} {...attrs} />
      <span className={styles.box} />

      {label}
    </label>
  );
};

export { Radio };
export type { Props as RadioProps };
