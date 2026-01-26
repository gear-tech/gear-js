import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import styles from './badge.module.scss';

type Props = PropsWithChildren & {
  color?: number | 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'sm';
  className?: string;
};

const Badge = ({ children, className, color = 'primary', size = 'default' }: Props) => {
  return <div className={clsx(styles.container, styles[size], styles[color], className)}>{children}</div>;
};

export { Badge };
