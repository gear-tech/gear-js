import { useMemo, ReactNode } from 'react';
import { ProgramMetadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';

import { Table, ExpandedTableRow } from 'shared/ui/table';
import { PreformattedBlock } from 'shared/ui/preformattedBlock';

type Props = {
  metadata: ProgramMetadata;
};

const MetadataTable = ({ metadata }: Props) => {
  const tableRows = useMemo(() => {
    const items: ReactNode[] = [];

    if (metadata.types) {
      // const decodedTypes = decodeHexTypes(metadata.types);
      const decodedTypes = '';

      // on each type, exec metadata.getTypeName(index) to get name
      // metadata.types;
      // metadata.getTypeName();

      Object.entries(metadata).forEach(([key, value]) => {
        if (value && key !== 'types' && key !== 'title') {
          const type = createPayloadTypeStructure(value, decodedTypes, true);

          items.push(
            <ExpandedTableRow key={key} name={key} value={value}>
              <PreformattedBlock text={type} />
            </ExpandedTableRow>,
          );
        }
      });
    }

    return items;
  }, [metadata]);

  return <Table>{tableRows}</Table>;
};

export { MetadataTable };
