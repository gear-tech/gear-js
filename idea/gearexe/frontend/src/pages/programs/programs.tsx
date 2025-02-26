import { generatePath } from 'react-router-dom';

import { HashLink, Navigation, Table } from '@/components';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';

import styles from './programs.module.scss';

type DataRow = {
  id: string;
  programId: string;
  balance: string;
  messages: string;
  createdAt: string;
};

const data: DataRow[] = [
  {
    id: '1',
    programId: '0xe189e481b26241ad656c73375cf88d6daddf91a2',
    balance: '200,000,000,000.000 WARA',
    messages: '123',
    createdAt: '12-19-2024 10:30:24',
  },
  {
    id: '2',
    programId: '0xe189e481b26241ad656c73375cf88d6daddf91a2',
    balance: '100,000,000,000.000 WARA',
    messages: '323',
    createdAt: '14-19-2024 10:30:24',
  },
];

const columns = [
  {
    key: 'programId' as const,
    title: 'PROGRAM ID',
    sortable: true,
    render: (programId: string) => <HashLink hash={programId} href={generatePath(routes.program, { programId })} />,
  },
  { key: 'balance' as const, title: 'BALANCE', sortable: true },
  { key: 'messages' as const, title: 'MESSAGES', sortable: true },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Programs = () => {
  return (
    <>
      <Navigation search={<Search />} />
      <div className={styles.container}>
        <Table columns={columns} data={data} lineHeight="lg" />
      </div>
    </>
  );
};

export { Programs };
