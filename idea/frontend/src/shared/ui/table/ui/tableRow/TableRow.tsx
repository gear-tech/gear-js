import { ReactNode } from 'react';

import styles from '../Table.module.scss';

type Props = {
  name: string;
  children: ReactNode;
};

const TableRow = ({ name, children }: Props) => (
  <div className={styles.tableRow}>
    <span className={styles.name}>{name}</span>
    <div>{children}</div>
  </div>
);

export { TableRow };
