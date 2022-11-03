import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from './Subheader.module.scss';

type Props = {
  size?: 'medium' | 'big';
  title: string;
  children?: ReactNode;
};

const Subheader = ({ size = 'medium', title, children }: Props) => (
  <div className={clsx(styles.subheader, styles[size])}>
    <h2 className={styles.title}>{title}</h2>
    {children}
  </div>
);

export { Subheader };
