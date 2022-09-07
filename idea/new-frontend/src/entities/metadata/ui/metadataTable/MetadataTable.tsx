import { useMemo, ReactNode } from 'react';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';

import { getPreformattedText } from 'shared/helpers';
import { Table, ExpandedTableRow } from 'shared/ui/table';
import { PreformattedBlock } from 'shared/ui/preformattedBlock';

type Props = {
  metadata: Metadata;
};

const MetadataTable = ({ metadata }: Props) => {
  const tableRows = useMemo(() => {
    const items: ReactNode[] = [];

    if (metadata.types) {
      const decodedTypes = decodeHexTypes(metadata.types);

      Object.entries(metadata).forEach(([key, value]) => {
        if (value && key !== 'types' && key !== 'title') {
          const type = createPayloadTypeStructure(value, decodedTypes, true);

          items.push(
            <ExpandedTableRow key={key} name={key} value={value}>
              <PreformattedBlock text={getPreformattedText(type)} />
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
