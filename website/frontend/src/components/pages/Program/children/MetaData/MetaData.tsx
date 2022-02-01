import React, { FC } from 'react';
import { Metadata, getTypeStructure, parseHexTypes } from '@gear-js/api';
import { MetaField } from './children/MetaField/MetaField';
import styles from './MetaData.module.scss';

type Props = {
  metadata: Metadata | null;
};

export const MetaData: FC<Props> = ({ metadata }) => {
  const getMetaFields = () => {
    let items = [];

    if (metadata && metadata.types) {
      const types = parseHexTypes(metadata.types);
      let key: keyof typeof metadata;

      for (key in metadata) {
        if (metadata[key] && key !== 'types' && key !== 'title') {
          const type = getTypeStructure(metadata[key] as string, types);

          items.push({
            label: key,
            value: metadata[key],
            type,
          });
        }
      }
    }

    return items;
  };

  return (
    <div className={styles.fields}>
      <div className={styles.value}>
        {getMetaFields().map((item) => (
          <MetaField key={item.label} label={item.label} value={item.value} type={item.type} />
        ))}
      </div>
    </div>
  );
};
