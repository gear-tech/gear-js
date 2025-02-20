import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from './Table.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

const Table = ({ className, children }: Props) => <div className={clsx(styles.table, className)}>{children}</div>;

export { Table };
