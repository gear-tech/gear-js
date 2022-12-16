import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';

import { Link } from 'react-router-dom';
import { routes } from 'shared/config';
import { getBulbStatus } from '../../helpers';
import { IProgram, PROGRAM_STATUS_NAME } from '../../model';
import styles from './ProgramTable.module.scss';

type Props = {
  program: IProgram;
};

const ProgramTable = ({ program }: Props) => {
  const { id, timestamp, status, code } = program;

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

      {code && (
        <TableRow name="Codehash" hideOwerflow>
          <Link to={routes.codes} state={{ query: code.id }} className={styles.codeLink}>
            {code.id}
          </Link>
        </TableRow>
      )}
    </Table>
  );
};

export { ProgramTable };
