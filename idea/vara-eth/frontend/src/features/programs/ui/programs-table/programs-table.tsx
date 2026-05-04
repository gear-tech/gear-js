import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { generatePath } from 'react-router-dom';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store';
import { activityPanelOpenAtom } from '@/app/store/activity-panel';
import { HashLink, Pagination, Table } from '@/components';
import type { BreakpointSize } from '@/components/ui/media-query';
import { COLLAPSED_PAGE_SIZE, OPEN_PAGE_SIZE, routes } from '@/shared/config';
import { usePaginationEffects, useTablePagination } from '@/shared/hooks';
import { formatDate } from '@/shared/utils';
import { getTotalPages } from '@/shared/utils/pagination';
import { getAllProgramsQueryOptions, useGetAllProgramsQuery } from '../../lib';

const getColumns = (truncateSize: BreakpointSize) =>
  [
    {
      key: 'programId' as const,
      title: 'PROGRAM ID',
      sortable: true,
      render: (programId: string) => (
        <HashLink hash={programId} truncateSize={truncateSize} href={generatePath(routes.program, { programId })} />
      ),
    },

    { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
  ] as const;

type Props = {
  openPageSize?: number;
  collapsedPageSize?: number;
  codeId?: Hex;
  positionedAt?: 'top' | 'bottom';
  truncateSize?: BreakpointSize;
};

const ProgramsTable = ({
  openPageSize = OPEN_PAGE_SIZE,
  collapsedPageSize = COLLAPSED_PAGE_SIZE,
  positionedAt = 'top',
  codeId,
  truncateSize = 'md',
}: Props) => {
  const columns = useMemo(() => getColumns(truncateSize), [truncateSize]);
  const isActivityPanelOpen = useAtomValue(activityPanelOpenAtom);
  const { explorerUrl } = useAtomValue(nodeAtom);
  const effectivePageSize = isActivityPanelOpen ? openPageSize : collapsedPageSize;

  const { pagination, setPage, prefetchPage, getPlaceholder } = useTablePagination({
    effectivePageSize,
    smallPageSize: openPageSize,
    largePageSize: collapsedPageSize,
    getQueryOptions: ({ page, pageSize }) => getAllProgramsQueryOptions({ explorerUrl, page, pageSize, codeId }),
  });
  const { page, pageSize } = pagination;

  const {
    data: programsResponse,
    isPending,
    isFetching,
  } = useGetAllProgramsQuery(page, pageSize, codeId, getPlaceholder);

  const totalPages = getTotalPages({ totalItems: programsResponse?.total ?? 0, pageSize });
  usePaginationEffects({ page, pageSize, totalPages, setPage, prefetchPage });

  const data = programsResponse?.data?.map((program) => ({
    id: program.id,
    programId: program.id,
    createdAt: formatDate(program.createdAt),
  }));

  const headerRight = useMemo(
    () => <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} isFetching={isFetching} />,
    [isFetching, page, setPage, totalPages],
  );

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isPending}
      pageSize={pageSize}
      headerRight={headerRight}
      positionedAt={positionedAt}
    />
  );
};

export { ProgramsTable };
