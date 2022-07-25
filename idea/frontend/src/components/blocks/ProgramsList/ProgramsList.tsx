import { memo } from 'react';

import { getRowKey } from './helpers';
import { TABLE_COLS, TABLE_HEADER } from './const';
import { ProgramItem } from './children/ProgramItem';

import { ProgramModel } from 'types/program';
import { Table } from 'components/common/Table';

type Props = {
  address?: string;
  programs?: ProgramModel[];
  className?: string;
};

const ProgramsList = memo(({ address, programs, className }: Props) => {
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
      bodyClassName={className}
      renderRow={renderRow}
      getRowKey={getRowKey}
    />
  );
});

export { ProgramsList };
