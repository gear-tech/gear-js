import { IProgram, getBulbStatus } from 'entities/program';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { Subheader } from '../subheader';
import styles from './ProgramDetails.module.scss';

import { TableRow } from '../tableRow';

type Props = {
  program: IProgram;
};

const ProgramDetails = ({ program }: Props) => {
  const { id, timestamp, initStatus } = program;

  return (
    <article>
      <Subheader title="Program details" />
      <div className={styles.table}>
        <TableRow rowName="Progran ID">
          <IdBlock id={id} size="large" />
        </TableRow>
        <TableRow rowName="Status">
          <BulbBlock size="large" text={initStatus} status={getBulbStatus(initStatus)} />
        </TableRow>
        <TableRow rowName="Created at">
          <TimestampBlock size="large" timestamp={timestamp} />
        </TableRow>
      </div>
    </article>
  );
};

export { ProgramDetails };
