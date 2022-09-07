import { ReactNode } from 'react';

import styles from './TableRow.module.scss';

type Props = {
  rowName: string;
  children: ReactNode;
};

const TableRow = ({ rowName, children }: Props) => (
  <div className={styles.tableRow}>
    <span className={styles.rowName}>{rowName}</span>
    <div>{children}</div>
  </div>
);

export { TableRow };
