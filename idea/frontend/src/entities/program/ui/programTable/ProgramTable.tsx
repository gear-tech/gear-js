import { generatePath, Link } from 'react-router-dom';

import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { routes } from 'shared/config';

import { getBulbStatus } from '../../helpers';
import { IProgram, PROGRAM_STATUS_NAME } from '../../model';
import styles from './ProgramTable.module.scss';

type Props = {
  program: IProgram;
};

const ProgramTable = ({ program }: Props) => {
  const { id, timestamp, status, code } = program;
  const codeId = code?.id;

  const statusName = PROGRAM_STATUS_NAME[status];

  return (
    <Table>
      <TableRow name="Program ID">
        <IdBlock id={id} size="big" />
      </TableRow>
      <TableRow name="Status">
        <BulbBlock size="large" text={statusName} status={getBulbStatus(status)} />
      </TableRow>
      <TableRow name="Created at">
        <TimestampBlock size="large" timestamp={timestamp} />
      </TableRow>

      {codeId && (
        <TableRow name="Codehash" hideOwerflow>
          <Link to={generatePath(routes.code, { codeId })} className={styles.codeLink}>
            {codeId}
          </Link>
        </TableRow>
      )}
    </Table>
  );
};

export { ProgramTable };
