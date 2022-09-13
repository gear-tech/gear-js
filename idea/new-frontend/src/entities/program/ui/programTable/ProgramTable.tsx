import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';

import { getBulbStatus } from '../../helpers';
import { IProgram, PROGRAM_STATUS_NAME } from '../../model';

type Props = {
  program: IProgram;
};

const ProgramTable = ({ program }: Props) => {
  const { id, timestamp, initStatus } = program;

  const statusName = PROGRAM_STATUS_NAME[initStatus];

  return (
    <Table>
      <TableRow name="Progran ID">
        <IdBlock id={id} size="big" />
      </TableRow>
      <TableRow name="Status">
        <BulbBlock size="large" text={statusName} status={getBulbStatus(initStatus)} />
      </TableRow>
      <TableRow name="Created at">
        <TimestampBlock size="large" timestamp={timestamp} />
      </TableRow>
    </Table>
  );
};

export { ProgramTable };
