import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import TablePlaceholderSVG from '@/shared/assets/images/placeholders/table.svg?react';
import { getFlatNamedTypeEntries, getNamedTypes } from '@/features/uploadMetadata';
import { TableRow, Table } from '@/shared/ui/table';
import { ContentLoader } from '@/shared/ui/contentLoader';
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
  const namedTypeEntries = useMemo(() => {
    if (!metadata) return [];

    const namedTypes = getNamedTypes(metadata, (message) => alert.error(message));

    return getFlatNamedTypeEntries(namedTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const renderRows = () =>
    namedTypeEntries.map(([key, value]: any) => (
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
