import { memo } from 'react';

import styles from './CodesList.module.scss';
import { getRowKey } from './helpers';
import { TABLE_COLS, TABLE_HEADER } from './consts';
import { CodeItem } from './children/CodeItem';

import { CodeModel } from 'types/code';
import { Table } from 'components/common/Table';

type Props = {
  codes?: CodeModel[];
  isLoading: boolean;
  className?: string;
};

const CodesList = memo(({ codes, isLoading, className }: Props) => {
  const renderRow = (program: CodeModel) => <CodeItem code={program} />;

  return (
    <Table
      rows={codes}
      cols={TABLE_COLS}
      header={TABLE_HEADER}
      message="No codes"
      isLoading={isLoading}
      bodyClassName={className}
      renderRow={renderRow}
      getRowKey={getRowKey}
    />
  );
});

export { CodesList };
