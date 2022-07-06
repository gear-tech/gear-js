import { Metadata, decodeHexTypes } from '@gear-js/api';

import { META_FIELDS } from './const';

import { getPreformattedText } from 'helpers';

export const getMetaProperties = (metadata: Metadata): Metadata => {
  const valuesFromMeta = META_FIELDS.reduce((result, metaKey) => {
    const metaValue = metadata[metaKey];

    if (metaKey !== 'types' && metaValue) {
      // eslint-disable-next-line no-param-reassign
      result[metaKey] = metaValue;
    }

    return result;
  }, {} as Metadata);

  if (metadata.types) {
    const decodedTypes = decodeHexTypes(metadata.types);
    valuesFromMeta.types = getPreformattedText(decodedTypes);
  }

  return valuesFromMeta;
};
