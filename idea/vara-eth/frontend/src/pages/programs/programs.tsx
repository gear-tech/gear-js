import { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { HashLink, Pagination, Table } from '@/components';
import { useGetAllProgramsQuery } from '@/features/programs';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import styles from './programs.module.scss';

type DataRow = {
  id: string;
  programId: string;
  createdAt: string;
};

const PAGE_SIZE = 7;

const columns = [
  {
    key: 'programId' as const,
    title: 'PROGRAM ID',
    sortable: true,
    render: (programId: string) => <HashLink hash={programId} href={generatePath(routes.program, { programId })} />,
  },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Programs = () => {
  const [page, setPage] = useState(1);
  const { data: programsResponse, isFetching } = useGetAllProgramsQuery(page, PAGE_SIZE);

  const data: DataRow[] =
    programsResponse?.data?.map((program) => ({
      id: program.id,
      programId: program.id,
      createdAt: formatDate(program.createdAt),
    })) ?? [];

  const totalItems = programsResponse?.total ?? 0;
  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 1;

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={data}
        isFetching={isFetching}
        lineHeight="lg"
        headerRight={<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      />
    </div>
  );
};

export { Programs };
