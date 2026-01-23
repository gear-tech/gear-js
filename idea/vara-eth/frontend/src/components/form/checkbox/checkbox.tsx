import { InputHTMLAttributes } from 'react';

import { cx } from '@/shared/utils';

import styles from './checkbox.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = ({ label, className, ...props }: Props) => {
  return (
    <label className={cx(styles.container, className)}>
      <input type="checkbox" className={styles.input} {...props} />
      <span className={styles.box} />
      {label && <span>{label}</span>}
    </label>
  );
};

export { Checkbox };
