import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import styles from './Badge.module.scss';

type Props = PropsWithChildren & {
  color?: number | 'primary' | 'secondary';
  className?: string;
};

const Badge = ({ children, className, color = 'primary' }: Props) => {
  const variant = typeof color === 'number' ? `color-${(color % 10) + 1}` : color;

  return <div className={clsx(styles.container, styles[variant], className)}>{children}</div>;
};

export { Badge };
