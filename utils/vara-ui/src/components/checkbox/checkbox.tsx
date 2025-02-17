import { ComponentPropsWithRef, ReactNode } from 'react';
import cx from 'clsx';

import styles from './checkbox.module.scss';

type Props = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  label: string;
  type?: 'switch' | 'checkbox';
  size?: 'small' | 'default';
  error?: ReactNode;
};

const Checkbox = ({ label, className, type = 'checkbox', size = 'default', error, ...attrs }: Props) => {
  return (
    <label className={cx(styles.label, className, styles[size])}>
      <input type="checkbox" className={styles.input} aria-invalid={Boolean(error)} {...attrs} />
      <span className={cx(styles.box, styles[type])} />

      {label}
    </label>
  );
};
export { Checkbox };
export type { Props as CheckboxProps };
