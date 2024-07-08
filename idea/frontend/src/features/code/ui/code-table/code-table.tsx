import { generatePath } from 'react-router-dom';

import { ICode } from '@/entities/code';
import { ContentLoader } from '@/shared/ui/contentLoader';
import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { IdBlock } from '@/shared/ui/idBlock';
import { Table, TableRow } from '@/shared/ui/table';
import { LocalCode } from '@/features/local-indexer/types';

type Props = {
  code: ICode | LocalCode | undefined;
  isCodeReady: boolean;
};

const CodeTable = ({ code, isCodeReady }: Props) =>
  code && isCodeReady ? (
    <Table>
      <TableRow name="Code ID">
        <IdBlock id={code.id} size="big" />
      </TableRow>

      {'blockHash' in code && (
        <TableRow name="Block hash">
          <IdBlock
            id={code.blockHash}
            to={generatePath(absoluteRoutes.block, { blockId: code.blockHash })}
            size="big"
          />
        </TableRow>
      )}
    </Table>
  ) : (
    <ContentLoader text="There is no program" isEmpty={isCodeReady && !code}>
      <TablePlaceholderSVG />
    </ContentLoader>
  );

export { CodeTable };
