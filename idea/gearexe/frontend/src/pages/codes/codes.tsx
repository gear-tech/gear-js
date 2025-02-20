import { generatePath } from 'react-router-dom';

import VerifySvg from '@/assets/icons/verify.svg?react';
import { HashLink, Table, Tooltip } from '@/components';
import { routes } from '@/shared/config';

import styles from './codes.module.scss';

type DataRow = {
  id: string;
  codeId: string;
  programsCount: string;
  services: string;
  createdAt: string;
};

const data: DataRow[] = [
  {
    id: '1',
    codeId: '0xdWC17F958D2ee523a2206206994597C13D831ec7',
    programsCount: '123',
    services: 'Service 1',
    createdAt: '12-19-2024 10:30:24',
  },
];

const columns = [
  {
    key: 'codeId' as const,
    title: 'CODE ID',
    sortable: true,
    render: (codeId: string) => (
      <div className={styles.codeIdWrapper}>
        <HashLink hash={codeId} href={generatePath(routes.code, { codeId })} />
        <Tooltip value="Verified">
          <VerifySvg />
        </Tooltip>
      </div>
    ),
  },
  { key: 'programsCount' as const, title: 'PROGRAMS', sortable: true },
  // ! TODO: filtrable
  { key: 'services' as const, title: 'SERVICES', sortable: true },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
];

const Codes = () => {
  return (
    <div className={styles.container}>
      <Table columns={columns} data={data} />
    </div>
  );
};

export { Codes };
