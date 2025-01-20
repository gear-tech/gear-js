import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from './Subheader.module.scss';

type Props = {
  size?: 'medium' | 'big';
  title: string;
  children?: ReactNode;
  className?: string;
};

const Subheader = ({ size = 'medium', title, children, className }: Props) => (
  <div className={clsx(styles.subheader, styles[size], className)}>
    <h2 className={styles.title}>{title}</h2>
    {children}
  </div>
);

export { Subheader };
