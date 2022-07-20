import { ReactNode, useMemo } from 'react';

import styles from './Table.module.scss';
import { HeaderItem } from './children/HeaderItem';
import { HeaderCol } from './types';

type Props = {
  cols: number[];
  rows: any[];
  header: HeaderCol[];
  className?: string;
  renderRow: (row: any, index: number) => ReactNode;
  getRowKey: (row: any, index: number) => string | number;
};

const Table = (props: Props) => {
  const { header, cols, rows, getRowKey, className, renderRow } = props;

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: cols.map((number) => `${number}fr`).join(' '),
    }),
    [cols]
  );

  return (
    <div className={className}>
      <header style={gridStyle} className={styles.header}>
        {header.map((item) => (
          <HeaderItem key={item.text} {...item} />
        ))}
      </header>

      <div>
        {rows.map((row, index) => (
          <div key={getRowKey(row, index)} style={gridStyle} className={styles.tableRow}>
            {renderRow(row, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Table };
