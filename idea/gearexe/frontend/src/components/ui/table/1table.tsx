import React, { useState } from 'react';
import { clsx } from 'clsx';
import SortSVG from '@/assets/icons/sort.svg?react';
import styles from './table.module.scss';

type TableColumn<T> = {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  lineHeight?: 'md' | 'lg';
};

// ! TODO: add pagination
const Table = <T extends { id: string | number }>({ columns, data, lineHeight = 'md' }: TableProps<T>) => {
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

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  return (
    <table className={clsx(styles.table, styles[`lineHeight-${lineHeight}`])}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key as string}
              onClick={() => column.sortable && handleSort(column.key)}
              className={column.sortable ? styles.sortable : ''}>
              {column.title} <SortSVG />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.key as string}>
                {/* // ! TODO */}
                {/* @ts-ignore */}
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table, type TableColumn, type TableProps };
