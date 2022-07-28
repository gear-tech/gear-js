import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';

import styles from './Table.module.scss';
import { HeaderCol } from './types';
import { HeaderItem } from './children/HeaderItem';
import { Spinner } from '../Spinner/Spinner';

type Props = {
  cols: number[];
  rows?: any[];
  header: HeaderCol[];
  message?: string;
  isLoading?: boolean;
  className?: string;
  bodyClassName?: string;
  renderRow: (row: any, index: number) => ReactNode;
  getRowKey: (row: any, index: number) => string | number;
};

const Table = (props: Props) => {
  const {
    header,
    cols,
    rows,
    getRowKey,
    message = 'No content',
    className,
    isLoading = false,
    bodyClassName,
    renderRow,
  } = props;

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: cols.map((number) => `${number}fr`).join(' '),
    }),
    [cols]
  );

  const getRows = () => {
    if (!rows || !rows.length) {
      return <p className={styles.message}>{message}</p>;
    }

    return rows?.map((row, index) => (
      <div key={getRowKey(row, index)} style={gridStyle} className={styles.tableRow}>
        {renderRow(row, index)}
      </div>
    ));
  };

  return (
    <div className={className}>
      <header style={gridStyle} className={styles.header}>
        {header.map((item) => (
          <HeaderItem key={item.text} {...item} />
        ))}
      </header>

      <div className={clsx(styles.tableBody, bodyClassName)}>{isLoading ? <Spinner absolute /> : getRows()}</div>
    </div>
  );
};

export { Table };
