import { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { HashLink, Navigation, Pagination, Table } from '@/components';
import { useGetAllProgramsQuery } from '@/features/programs';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';

import styles from './programs.module.scss';

type DataRow = {
  id: string;
  programId: string;
  messages: string;
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
  { key: 'messages' as const, title: 'MESSAGES', sortable: true },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Programs = () => {
  const [page, setPage] = useState(1);
  const { data: allPrograms, isFetching } = useGetAllProgramsQuery(page, PAGE_SIZE);

  const data: DataRow[] =
    allPrograms?.nodes.map((program) => ({
      id: program.id,
      programId: program.id,
      // ! TODO: get messages count
      messages: '0',
      // ! TODO: format createdAtBlock to date
      createdAt: program.createdAtBlock.toString(), // createdAt: '14-19-2024 10:30:24',
    })) ?? [];

  const totalItems = allPrograms?.totalCount ?? 0;
  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 1;

  return (
    <>
      <Navigation search={<Search />} />
      <div className={styles.container}>
        <Table
          columns={columns}
          data={data}
          isFetching={isFetching}
          lineHeight="lg"
          headerRight={<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
        />
      </div>
    </>
  );
};

export { Programs };
