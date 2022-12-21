import { ProgramMetadata, HumanTypesRepr } from '@gear-js/api';
import isPlainObject from 'lodash.isplainobject';

import { META_FIELDS } from '../model';

// TODO: refactor and types
const getMetadataProperties = (metadata: ProgramMetadata) => {
  const valuesFromMeta = META_FIELDS.reduce((result, metaKey) => {
    const metaValue = metadata.types[metaKey];

    if (isPlainObject(metaValue)) {
      const types = metaValue as HumanTypesRepr;
      const { input, output } = types;

      if (input) {
        const typeName = metadata.getTypeName(input);

        if (result[metaKey]) {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          result[metaKey].input = typeName;
        } else {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          result[metaKey] = { input: typeName };
        }
      }

      if (output) {
        const typeName = metadata.getTypeName(output);

        if (result[metaKey]) {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          result[metaKey].output = typeName;
        } else {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          result[metaKey] = { output: typeName };
        }
      }
    } else if (metaValue) {
      // eslint-disable-next-line no-param-reassign
      result[metaKey] = metadata.getTypeName(metaValue as number).toJSON();
    }

    return result;
  }, {} as any);

  // if (metadata.types) {
  //   const decodedTypes = decodeHexTypes(metadata.types);
  //   valuesFromMeta.types = getPreformattedText(decodedTypes) as Hex;

  //   // types:
  //   metadata.getAllTypes();
  // }

  valuesFromMeta.types = metadata.getAllTypes();

  return valuesFromMeta;
};

export { getMetadataProperties };
