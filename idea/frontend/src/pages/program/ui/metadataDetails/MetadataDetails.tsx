import { ProgramMetadata } from '@gear-js/api';

import { ReactComponent as MetadataDetailsSVG } from 'shared/assets/images/placeholders/metadataDetails.svg';
import { getFlatNamedTypeEntries, getNamedTypes } from 'features/uploadMetadata';
import { TableRow, Table } from 'shared/ui/table';
import tableStyles from 'shared/ui/table/ui/Table.module.scss';

import { ContentLoader } from '../contentLoader';

type Props = {
  metadata: ProgramMetadata | undefined;
  isLoading: boolean;
};

const MetadataDetails = ({ metadata, isLoading }: Props) => {
  const isEmpty = !(isLoading || metadata);
  const isLoaderShowing = isLoading || !metadata;

  const renderRows = (meta: ProgramMetadata) => {
    const namedTypes = getNamedTypes(meta);
    const entries = getFlatNamedTypeEntries(namedTypes);

    return entries.map(([key, value]: any) => (
      <TableRow key={key} name={key}>
        <span className={tableStyles.value}>{String(value)}</span>
      </TableRow>
    ));
  };

  return isLoaderShowing ? (
    <ContentLoader text="There is no metadata yet" isEmpty={isEmpty}>
      <MetadataDetailsSVG />
    </ContentLoader>
  ) : (
    <Table>{renderRows(metadata)}</Table>
  );
};

export { MetadataDetails };
