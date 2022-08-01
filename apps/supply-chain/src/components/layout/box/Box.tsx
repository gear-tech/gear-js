import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Box.module.scss';

type Props = {
  children: ReactNode;
  secondary?: boolean;
};

function Box({ children, secondary }: Props) {
  return <div className={clsx(styles.box, secondary ? styles.secondary : styles.primary)}>{children}</div>;
}

export { Box };
