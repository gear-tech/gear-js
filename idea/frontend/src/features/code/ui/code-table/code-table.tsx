import { generatePath } from 'react-router-dom';

import { ICode } from 'entities/code';
import { ContentLoader } from 'shared/ui/contentLoader';
import { ReactComponent as TablePlaceholderSVG } from 'shared/assets/images/placeholders/table.svg';
import { absoluteRoutes } from 'shared/config';
import { IdBlock } from 'shared/ui/idBlock';
import { Table, TableRow } from 'shared/ui/table';

type Props = {
  code: ICode | undefined;
  isCodeReady: boolean;
};

const CodeTable = ({ code, isCodeReady }: Props) =>
  code && isCodeReady ? (
    <Table>
      <TableRow name="Code ID">
        <IdBlock id={code.id} size="big" />
      </TableRow>

      <TableRow name="Block hash">
        <IdBlock id={code.blockHash} to={generatePath(absoluteRoutes.block, { blockId: code.blockHash })} size="big" />
      </TableRow>
    </Table>
  ) : (
    <ContentLoader text="There is no program" isEmpty={isCodeReady && !code}>
      <TablePlaceholderSVG />
    </ContentLoader>
  );

export { CodeTable };
