import { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { HashLink, Pagination, Table } from '@/components';
import { useGetAllCodesQuery } from '@/features/codes';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import styles from './codes.module.scss';

type DataRow = {
  id: string;
  codeId: string;
  createdAt: string;
};

const PAGE_SIZE = 10;

const columns = [
  {
    key: 'codeId' as const,
    title: 'CODE ID',
    sortable: true,
    render: (codeId: string) => (
      <div className={styles.codeIdWrapper}>
        <HashLink hash={codeId} href={generatePath(routes.code, { codeId })} />
        {/* <Tooltip value="Verified">
          <VerifySvg />
        </Tooltip> */}
      </div>
    ),
  },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Codes = () => {
  const [page, setPage] = useState(1);
  const { data: allCodes, isFetching } = useGetAllCodesQuery(page, PAGE_SIZE);

  const data: DataRow[] =
    allCodes?.data.map((code) => ({
      id: code.id,
      codeId: code.id,
      createdAt: formatDate(code.createdAt),
    })) || [];

  const totalItems = allCodes?.total ?? 0;
  const totalPages = totalItems ? Math.ceil(totalItems / PAGE_SIZE) : 1;

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={data}
        isFetching={isFetching}
        headerRight={<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      />
    </div>
  );
};

export { Codes };
