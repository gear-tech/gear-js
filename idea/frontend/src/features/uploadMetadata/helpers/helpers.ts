import { Metadata, decodeHexTypes, Hex } from '@gear-js/api';

import { getPreformattedText } from 'shared/helpers';

import { META_FIELDS } from '../model';

const getMetadataProperties = (metadata: Metadata): Metadata => {
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
    valuesFromMeta.types = getPreformattedText(decodedTypes) as Hex;
  }

  return valuesFromMeta;
};

export { getMetadataProperties };
