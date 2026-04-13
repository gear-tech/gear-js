import type { PropsWithChildren } from 'react';

import type { PropsWithClassName } from '@/shared/types';
import { cx } from '@/shared/utils';

import styles from './label-container.module.scss';

type Props = PropsWithChildren &
  PropsWithClassName & {
    id?: string;
    label?: string;
    error?: string;
  };

const LabelContainer = ({ id, className, label, children, error }: Props) => {
  return (
    <label className={cx(styles.container, className)} htmlFor={id}>
      {label && <span className={styles.label}>{label}:</span>}

      <div className={styles.content}>
        {children}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </label>
  );
};

export { LabelContainer };
