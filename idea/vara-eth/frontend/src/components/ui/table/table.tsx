import { clsx } from 'clsx';
import React, { useMemo, useState } from 'react';

import SortSVG from '@/assets/icons/sort.svg?react';

import { Skeleton } from '../skeleton';

import styles from './table.module.scss';

type TableColumn<T> = {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[] | undefined;
  pageSize?: number;
  lineHeight?: 'md' | 'lg';
  headerRight?: React.ReactNode;
};

const Table = <T extends { id: string | number }>({
  columns,
  data,
  pageSize = 5,
  lineHeight = 'md',
  headerRight,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!data) return;
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;

      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const hasExtraColumn = Boolean(headerRight);

  const render = () => {
    return (sortedData || Array.from({ length: pageSize })).map((row: T | undefined, index) => (
      <tr key={row ? row.id : `skeleton-${index}`}>
        {columns.map((column) => (
          <td key={column.key as string}>
            {row ? column.render?.(row[column.key], row) || String(row[column.key]) : <Skeleton width="16rem" />}
          </td>
        ))}

        {hasExtraColumn && <td />}
      </tr>
    ));
  };

  return (
    <table className={clsx(styles.table, styles[`lineHeight-${lineHeight}`])}>
      <thead>
        <tr>
          {columns.map((column: TableColumn<T>) => (
            <th
              key={column.key as string}
              onClick={() => column.sortable && handleSort(column.key)}
              className={column.sortable ? styles.sortable : ''}>
              {column.title} <SortSVG />
            </th>
          ))}

          {hasExtraColumn && (
            <th className={styles.headerRightCell}>
              <div className={styles.headerRight}>{headerRight}</div>
            </th>
          )}
        </tr>
      </thead>

      <tbody>{render()}</tbody>
    </table>
  );
};

export { Table, type TableColumn, type TableProps };
