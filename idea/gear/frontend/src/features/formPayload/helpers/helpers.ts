import { toJSON, ProgramMetadata, StateMetadata } from '@gear-js/api';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';

import { TypeStructure, PayloadValue } from '@/entities/formPayload';
import { getPreformattedText, isNumeric } from '@/shared/helpers';

const getItemLabel = (name: string, title?: string) => (title ? `${title} (${name})` : name);

const getNextLevelName = (currentLevelName: string, nextLevelName: string | number) =>
  `${currentLevelName}.${nextLevelName}`;

// TODO(#1737): fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSubmitPayload = (payload: PayloadValue): any => {
  if (isString(payload)) {
    const trimmedPayload = payload.trim();

    return isNumeric(trimmedPayload) ? trimmedPayload : toJSON(trimmedPayload);
  }

  if (isPlainObject(payload)) {
    const preparedValues = Object.entries(payload!).map((item) => [item[0], getSubmitPayload(item[1])]);

    return Object.fromEntries(preparedValues);
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => getSubmitPayload(item));
  }

  return payload;
};

const getPayloadValue = (typeStructure: TypeStructure | null): PayloadValue => {
  if (!typeStructure) return null;

  const { kind, type } = typeStructure;

  switch (kind) {
    case 'sequence':
    case 'array': {
      if (!isPlainObject(type)) {
        console.error('Value of type "sequence" is not an object');

        return '[ ]';
      }

      // @ts-expect-error - TODO(#1738): explain why it should be ignored
      return getPreformattedText([getPayloadValue(type)]);
    }

    case 'tuple': {
      if (!Array.isArray(type)) {
        console.error('Value of type "Tuple" is not an array');

        return [];
      }

      return type.map(getPayloadValue);
    }

    case 'variant': {
      if (!isPlainObject(type)) {
        console.error('Value of type "variant" is not an object');

        return {};
      }

      const [firstKey, firstValue] = Object.entries(type)[0];

      return {
        [firstKey]: getPayloadValue(firstValue),
      };
    }

    case 'composite': {
      if (!isPlainObject(type)) {
        console.error('Value of type "composite" is not an object');

        return {};
      }

      const structure = Object.entries(type).map((item) => [item[0], getPayloadValue(item[1])]);

      return Object.fromEntries(structure);
    }

    case 'primitive':
    case 'actorid': {
      return '';
    }

    default:
      return null;
  }
};

const getPayloadFormValues = (metadata: ProgramMetadata | StateMetadata, metaIndex: number) => {
  const typeDef = metadata.getTypeDef(metaIndex);
  const extendedTypeDef = metadata.getTypeDef(metaIndex, true);
  const payload = getPayloadValue(extendedTypeDef);

  return { payload, manualPayload: getPreformattedText(typeDef), typeStructure: extendedTypeDef };
};

const getResetPayloadValue = (payload: PayloadValue): PayloadValue => {
  if (isString(payload)) {
    return '';
  }

  if (Array.isArray(payload)) {
    return payload.map((value) => getResetPayloadValue(value));
  }

  if (isPlainObject(payload)) {
    const preparedValues = Object.entries(payload!).map(([key, value]) => [key, getResetPayloadValue(value)]);

    return Object.fromEntries(preparedValues);
  }

  return payload;
};

export {
  getItemLabel,
  getPayloadValue,
  getNextLevelName,
  getSubmitPayload,
  getPayloadFormValues,
  getResetPayloadValue,
};
