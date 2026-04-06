import { useState } from 'react';
import { generatePath } from 'react-router-dom';
import type { Hex } from 'viem';

import { HashLink, Pagination, Table } from '@/components';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import { useGetAllProgramsQuery } from '../../lib';

const COLUMNS = [
  {
    key: 'programId' as const,
    title: 'PROGRAM ID',
    sortable: true,
    render: (programId: string) => (
      <HashLink hash={programId} truncateSize="xxl" href={generatePath(routes.program, { programId })} />
    ),
  },

  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
] as const;

type Props = {
  pageSize?: number;
  codeId?: Hex;
  positionedAt?: 'top' | 'bottom';
};

const ProgramsTable = ({ pageSize = 7, positionedAt = 'top', codeId }: Props) => {
  const [page, setPage] = useState(1);
  const { data: programsResponse, isFetching } = useGetAllProgramsQuery(page, pageSize, codeId);

  const data = programsResponse?.data?.map((program) => ({
    id: program.id,
    programId: program.id,
    createdAt: formatDate(program.createdAt),
  }));

  const totalItems = programsResponse?.total ?? 0;
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;

  return (
    <Table
      columns={COLUMNS}
      data={data}
      isLoading={isFetching}
      lineHeight="lg"
      pageSize={pageSize}
      headerRight={<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      positionedAt={positionedAt}
    />
  );
};

export { ProgramsTable };
