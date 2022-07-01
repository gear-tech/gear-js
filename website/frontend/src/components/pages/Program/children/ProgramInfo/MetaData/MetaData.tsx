import { useMemo } from 'react';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';

import styles from './MetaData.module.scss';
import { MetaField } from './children/MetaField/MetaField';

type Props = {
  metadata: Metadata;
};

const MetaData = ({ metadata }: Props) => {
  const metaFields = useMemo(() => {
    const items = [];

    if (metadata.types) {
      const decodedTypes = decodeHexTypes(metadata.types);
      // eslint-disable-next-line guard-for-in
      for (const key in metadata) {
        const value = metadata[key as keyof Metadata];

        if (value && key !== 'types' && key !== 'title') {
          const type = createPayloadTypeStructure(value, decodedTypes, true);

          items.push(<MetaField key={key} type={type} label={key} value={value} />);
        }
      }
    }

    return items;
  }, [metadata]);

  return <div className={styles.fields}>{metaFields}</div>;
};

export { MetaData };
