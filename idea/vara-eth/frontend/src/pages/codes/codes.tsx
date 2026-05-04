import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { generatePath } from 'react-router-dom';

import { nodeAtom } from '@/app/store';
import { activityPanelOpenAtom } from '@/app/store/activity-panel';
import { HashLink, Pagination, Table } from '@/components';
import { getAllCodesQueryOptions, useGetAllCodesQuery } from '@/features/codes/lib';
import { COLLAPSED_PAGE_SIZE, OPEN_PAGE_SIZE, routes } from '@/shared/config';
import { usePaginationEffects, useTablePagination } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';
import { getTotalPages } from '@/shared/utils/pagination';

import styles from './codes.module.scss';

const columns = [
  {
    key: 'codeId' as const,
    title: 'CODE ID',
    sortable: true,
    render: (codeId: string) => (
      <div className={styles.codeIdWrapper}>
        <HashLink hash={codeId} truncateSize="lg" href={generatePath(routes.code, { codeId })} />
      </div>
    ),
  },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Codes = () => {
  const isActivityPanelOpen = useAtomValue(activityPanelOpenAtom);
  const { explorerUrl } = useAtomValue(nodeAtom);
  const effectivePageSize = isActivityPanelOpen ? OPEN_PAGE_SIZE : COLLAPSED_PAGE_SIZE;

  const { pagination, setPage, prefetchPage, getPlaceholder } = useTablePagination({
    effectivePageSize,
    getQueryOptions: ({ page, pageSize }) => getAllCodesQueryOptions({ explorerUrl, page, pageSize }),
  });
  const { page, pageSize } = pagination;

  const { data: allCodes, isPending, isFetching } = useGetAllCodesQuery(page, pageSize, getPlaceholder);

  const totalPages = getTotalPages({ totalItems: allCodes?.total ?? 0, pageSize });
  usePaginationEffects({ page, pageSize, totalPages, setPage, prefetchPage });

  const data = allCodes?.data.map((code) => ({
    id: code.id,
    codeId: code.id,
    createdAt: formatDate(code.createdAt),
  }));

  const headerRight = useMemo(
    () => <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} isFetching={isFetching} />,
    [isFetching, page, setPage, totalPages],
  );

  return (
    <div className={styles.container}>
      <Table columns={columns} data={data} isLoading={isPending} pageSize={pageSize} headerRight={headerRight} />
    </div>
  );
};

export { Codes };
