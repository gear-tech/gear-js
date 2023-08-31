import { generatePath } from 'react-router-dom';

import { IProgram, PROGRAM_STATUS_NAME, getBulbStatus } from 'entities/program';
import { routes, absoluteRoutes } from 'shared/config';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { IdBlock } from 'shared/ui/idBlock';
import { Table, TableRow } from 'shared/ui/table';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ContentLoader } from 'shared/ui/contentLoader';

import { ReactComponent as PlaceholderSVG } from '../../assets/program-table-placeholder.svg';

type Props = {
  program: IProgram | undefined;
  isProgramReady: boolean;
};

const ProgramTable = ({ program, isProgramReady }: Props) => {
  const { code } = program || {};
  const codeId = code?.id;

  return isProgramReady && program ? (
    <Table>
      <TableRow name="Program ID">
        <IdBlock id={program.id} size="big" />
      </TableRow>

      <TableRow name="Status">
        <BulbBlock size="large" text={PROGRAM_STATUS_NAME[program.status]} status={getBulbStatus(program.status)} />
      </TableRow>

      <TableRow name="Created at">
        <TimestampBlock size="large" timestamp={program.timestamp} />
      </TableRow>

      {codeId && (
        <TableRow name="Codehash" hideOwerflow>
          <IdBlock id={program.blockHash} to={generatePath(routes.code, { codeId })} size="big" />
        </TableRow>
      )}

      <TableRow name="Block hash">
        <IdBlock
          id={program.blockHash}
          to={generatePath(absoluteRoutes.block, { blockId: program.blockHash })}
          size="big"
        />
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There is no program" isEmpty={isProgramReady && !program}>
      <PlaceholderSVG />
    </ContentLoader>
  );
};

export { ProgramTable };
