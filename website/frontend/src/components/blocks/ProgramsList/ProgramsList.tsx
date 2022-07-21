import { memo } from 'react';

import styles from './ProgramList.module.scss';
import { getRowKey } from './helpers';
import { TABLE_COLS, TABLE_HEADER } from './const';
import { ProgramItem } from './children/ProgramItem';

import { ProgramModel } from 'types/program';
import { Table } from 'components/common/Table';

type Props = {
  address?: string;
  programs?: ProgramModel[];
};

const ProgramsList = memo(({ address, programs }: Props) => {
  const renderRow = (program: ProgramModel) => (
    <ProgramItem program={program} isMetaLinkActive={program.owner === address} />
  );

  return (
    <Table
      rows={programs}
      cols={TABLE_COLS}
      header={TABLE_HEADER}
      message="No programs"
      isLoading={!programs}
      bodyClassName={styles.tableBody}
      renderRow={renderRow}
      getRowKey={getRowKey}
    />
  );
});

export { ProgramsList };
