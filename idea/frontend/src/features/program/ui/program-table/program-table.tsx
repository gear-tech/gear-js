import { generatePath } from 'react-router-dom';

import { routes, absoluteRoutes } from '@/shared/config';
import { BulbBlock } from '@/shared/ui/bulbBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { Table, TableRow } from '@/shared/ui/table';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { ContentLoader } from '@/shared/ui/contentLoader';
import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import { LocalProgram } from '@/features/local-indexer';

import { IProgram } from '../../types';
import { PROGRAM_STATUS_NAME } from '../../consts';
import { getBulbStatus } from '../../utils';
import styles from './program-table.module.scss';

type Props = {
  program: IProgram | LocalProgram | undefined;
  isProgramReady: boolean;
};

const ProgramTable = ({ program, isProgramReady }: Props) => {
  const { codeId } = program || {};
  const blockId = program && 'blockHash' in program ? program.blockHash : undefined;

  return isProgramReady && program ? (
    <div className={styles.table}>
      <Table>
        <TableRow name="Program ID">
          <IdBlock id={program.id} size="big" />
        </TableRow>

        <TableRow name="Status">
          <BulbBlock size="large" text={PROGRAM_STATUS_NAME[program.status]} status={getBulbStatus(program.status)} />
        </TableRow>

        {'timestamp' in program && (
          <TableRow name="Created at">
            <TimestampBlock size="large" timestamp={program.timestamp} />
          </TableRow>
        )}
      </Table>

      <Table>
        {codeId && (
          <TableRow name="Codehash" hideOwerflow>
            <IdBlock id={codeId} to={generatePath(routes.code, { codeId })} size="big" />
          </TableRow>
        )}

        {blockId && (
          <TableRow name="Block hash">
            <IdBlock id={blockId} to={generatePath(absoluteRoutes.block, { blockId })} size="big" />
          </TableRow>
        )}
      </Table>
    </div>
  ) : (
    <ContentLoader text="There is no program" isEmpty={isProgramReady && !program}>
      <TablePlaceholderSVG />
    </ContentLoader>
  );
};

export { ProgramTable };
