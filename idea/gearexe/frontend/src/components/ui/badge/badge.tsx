import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import styles from './badge.module.scss';

type Props = PropsWithChildren & {
  color?: number | 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'sm';
  className?: string;
};

const Badge = ({ children, className, color = 'primary', size = 'default' }: Props) => {
  const variant = typeof color === 'number' ? `color-${(color % 10) + 1}` : color;

  return <div className={clsx(styles.container, styles[`size-${size}`], styles[variant], className)}>{children}</div>;
};

export { Badge };
