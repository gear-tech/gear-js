import { generatePath } from 'react-router-dom';
import { routes } from '@/shared/config';
import { HashLink, Table } from '@/components';
import styles from './Programs.module.scss';

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
    programId: '0x1fc57B23033339c33895BBBb7167cFA1B62e85BC',
    balance: '200,000,000,000.000 WARA',
    messages: '123',
    createdAt: '12-19-2024 10:30:24',
  },
  {
    id: '2',
    programId: '0xb7eBDAe409fe6944843c0187088c85682F890187',
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
    <div className={styles.container}>
      <Table columns={columns} data={data} lineHeight="lg" />
    </div>
  );
};

export { Programs };
