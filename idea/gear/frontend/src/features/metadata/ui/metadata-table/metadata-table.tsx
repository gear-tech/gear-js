import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { getFlatNamedTypeEntries, getNamedTypes } from '@/features/uploadMetadata';
import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import { ContentLoader } from '@/shared/ui/contentLoader';
import { TableRow, Table } from '@/shared/ui/table';
import tableStyles from '@/shared/ui/table/ui/Table.module.scss';

type Props = {
  metadata: ProgramMetadata | undefined;
  isLoading: boolean;
};

const MetadataTable = ({ metadata, isLoading }: Props) => {
  const alert = useAlert();

  const isEmpty = !(isLoading || metadata);
  const isLoaderShowing = isLoading || !metadata;

  // useMemo to prevent excessive error alerts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
  const namedTypeEntries = useMemo(() => {
    if (!metadata) return [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
    const namedTypes = getNamedTypes(metadata, (message) => alert.error(message));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument -- TODO(#1800): resolve eslint comments
    return getFlatNamedTypeEntries(namedTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const renderRows = () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any -- TODO(#1800): resolve eslint comments
    namedTypeEntries.map(([key, value]: any) => (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
      <TableRow key={key} name={key}>
        <span className={tableStyles.value}>{String(value)}</span>
      </TableRow>
    ));

  return isLoaderShowing ? (
    <ContentLoader text="There is no metadata yet" isEmpty={isEmpty}>
      <TablePlaceholderSVG />
    </ContentLoader>
  ) : (
    <Table>{renderRows()}</Table>
  );
};

export { MetadataTable };
