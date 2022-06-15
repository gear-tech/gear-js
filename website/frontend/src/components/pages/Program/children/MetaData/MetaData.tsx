import { FC } from 'react';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { MetaField } from './children/MetaField/MetaField';
import styles from './MetaData.module.scss';

type Props = {
  metadata: Metadata | null;
};

export const MetaData: FC<Props> = ({ metadata }) => {
  const getMetaFields = () => {
    const items = [];

    if (metadata && metadata.types) {
      const decodedTypes = decodeHexTypes(metadata.types);
      let key: keyof typeof metadata;

      for (key in metadata) {
        if (metadata[key] && key !== 'types' && key !== 'title') {
          const type = createPayloadTypeStructure(metadata[key] as string, decodedTypes, true);

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
