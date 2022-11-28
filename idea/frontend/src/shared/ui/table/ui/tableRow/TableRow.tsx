import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from '../Table.module.scss';

type Props = {
  name: string;
  children: ReactNode;
  hideOwerflow?: boolean;
};

const TableRow = ({ name, children, hideOwerflow }: Props) => (
  <div className={styles.tableRow}>
    <span className={styles.name}>{name}</span>
    <div className={clsx(hideOwerflow && styles.hideOwerflow)}>{children}</div>
  </div>
);

export { TableRow };
