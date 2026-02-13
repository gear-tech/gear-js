import { ReactNode } from 'react';

import { cx } from '@/shared/utils';

import styles from './skeleton.module.scss';

type Props = {
  width?: string;
  height?: string;
  borderRadius?: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
};

function Skeleton({ width, height, borderRadius, children, disabled, className }: Props) {
  return (
    <span
      className={cx(styles.skeleton, className, !disabled && styles.loading)}
      style={{ width, height, borderRadius }}>
      {children}
    </span>
  );
}

export { Skeleton };
