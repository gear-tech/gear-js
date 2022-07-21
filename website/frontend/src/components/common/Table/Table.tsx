import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';

import styles from './Table.module.scss';
import { HeaderItem } from './children/HeaderItem';
import { HeaderCol } from './types';

type Props = {
  cols: number[];
  rows: any[];
  header: HeaderCol[];
  className?: string;
  bodyClassName?: string;
  defaultMessage?: string;
  renderRow: (row: any, index: number) => ReactNode;
  getRowKey: (row: any, index: number) => string | number;
};

const Table = (props: Props) => {
  const { header, cols, rows, getRowKey, className, bodyClassName, defaultMessage = 'No content', renderRow } = props;

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: cols.map((number) => `${number}fr`).join(' '),
    }),
    [cols]
  );

  if (!rows.length) {
    return (
      <div className={className}>
        <p className={styles.emptyContent}>{defaultMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <header style={gridStyle} className={styles.header}>
        {header.map((item) => (
          <HeaderItem key={item.text} {...item} />
        ))}
      </header>

      <div className={clsx(styles.tableBody, bodyClassName)}>
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
