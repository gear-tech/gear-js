import { clsx } from 'clsx';
import type React from 'react';
import { useMemo, useState } from 'react';

import SortSVG from '@/assets/icons/sort.svg?react';

import { Skeleton } from '../skeleton';

import styles from './table.module.scss';

const SKELETON_WIDTHS = { sm: '6rem', md: '16rem' } as const;

type SkeletonWidth = keyof typeof SKELETON_WIDTHS;

type TableColumn<T> = {
  key: keyof T;
  title: string;
  sortable?: boolean;
  skeletonWidth?: SkeletonWidth;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: readonly TableColumn<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  pageSize?: number;
  lineHeight?: 'md' | 'lg';
  positionedAt?: 'top' | 'bottom';
  headerRight?: React.ReactNode;
};

const Table = <T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  pageSize = 5,
  lineHeight = 'md',
  positionedAt = 'top',
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

  const isEmpty = !isLoading && !data?.length;
  const lastColumnIndex = columns.length - 1;

  const render = () => {
    const placeholderData = Array.from<undefined>({ length: pageSize });
    const list = isLoading ? placeholderData : sortedData || placeholderData;

    return list.map((row, index) => (
      <tr key={row ? row.id : `skeleton-${index}`}>
        {columns.map((column) => (
          <td key={column.key as string}>
            {row ? (
              (column.render?.(row[column.key], row) ?? String(row[column.key]))
            ) : (
              <Skeleton width={SKELETON_WIDTHS[column.skeletonWidth ?? 'md']} />
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <table className={clsx(styles.table, styles[`lineHeight-${lineHeight}`], styles[positionedAt])}>
      <thead>
        <tr>
          {columns.map((column: TableColumn<T>, index) => {
            const isLast = index === lastColumnIndex;
            const title = (
              <span className={styles.headerTitle}>
                {column.title} <SortSVG />
              </span>
            );

            const onHeaderClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
              if (!column.sortable) return;
              if ((event.target as HTMLElement).closest(`.${styles.headerRight}`)) return;

              handleSort(column.key);
            };

            return (
              <th key={column.key as string} onClick={onHeaderClick} className={column.sortable ? styles.sortable : ''}>
                {isLast && headerRight ? (
                  <div className={styles.headerWithAction}>
                    {title}
                    <div className={styles.headerRight}>{headerRight}</div>
                  </div>
                ) : (
                  title
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {isEmpty ? (
          <tr className={styles.emptyRow}>
            <td colSpan={columns.length}>
              <div className={styles.emptyContainer}>
                <span className={styles.title}>
                  <span className={styles.comment}>{'//_'}</span>No Items Yet
                </span>

                <p className={styles.text}>Items will appear in this table as soon as they are available.</p>
              </div>
            </td>
          </tr>
        ) : (
          render()
        )}
      </tbody>
    </table>
  );
};

export { Table, type TableColumn, type TableProps };
