import { useMemo, ReactNode } from 'react';
import { ProgramMetadata, HumanTypesRepr } from '@gear-js/api';
import isPlainObject from 'lodash.isplainobject';

import { Table, TableRow } from 'shared/ui/table';
import tableStyles from 'shared/ui/table/ui/Table.module.scss';

type Props = {
  metadata: ProgramMetadata;
};

const MetadataTable = ({ metadata }: Props) => {
  const tableRows = useMemo(() => {
    const items: ReactNode[] = [];

    if (metadata.types) {
      Object.entries(metadata.types).forEach(([key, value]) => {
        const isValue = value !== null && value !== undefined;

        if (isPlainObject(value)) {
          Object.entries(value as HumanTypesRepr).forEach(([typeKey, typeValue]) => {
            const isTypeValue = typeValue !== null && typeValue !== undefined;

            if (isTypeValue) {
              const name = `${key}.${typeKey}`;
              const typeName = metadata.getTypeName(typeValue);

              items.push(
                <TableRow key={name} name={name}>
                  <span className={tableStyles.value}>{typeName}</span>
                </TableRow>,
              );
            }
          });
        } else if (isValue) {
          const typeName = metadata.getTypeName(value as number);

          items.push(
            <TableRow key={key} name={key}>
              <span className={tableStyles.value}>{typeName}</span>
            </TableRow>,
          );
        }
      });
    }

    return items;
  }, [metadata]);

  return <Table>{tableRows}</Table>;
};

export { MetadataTable };
