import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import { decodeHexTypes, createPayloadTypeStructure, toJSON } from '@gear-js/api';

import { ValueType, TypeStructure, PayloadValue, FormPayloadValues } from './types';

import { getPreformattedText } from 'helpers';

export const getNextLevelName = (currentLevelName: string, nextLevelName: string | number) =>
  `${currentLevelName}.${nextLevelName}`;

export const getItemLabel = (name: string, title?: string) => (title ? `${title} (${name})` : name);

export const getSubmitPayload = (payload: PayloadValue): PayloadValue => {
  if (isString(payload)) {
    return toJSON(payload.trim());
  }

  if (isPlainObject(payload)) {
    const preparedValues = Object.entries(payload!).map((item) => [item[0], getSubmitPayload(item[1])]);

    return Object.fromEntries(preparedValues);
  }

  return payload;
};

export const getPayloadValue = (typeStructure: TypeStructure): PayloadValue => {
  const { type, value, count } = typeStructure;

  switch (type) {
    case ValueType.Vec: {
      if (!isPlainObject(value)) {
        console.error('Value of type "Vec" is not an object');

        return '[ ]';
      }
      // @ts-ignore
      return getPreformattedText([getPayloadValue(value)]);
    }
    case ValueType.Array: {
      const arrayLength = count || 0;

      if (!isPlainObject(value)) {
        console.error('Value of type "Array" is not an object');

        return [];
      }
      // @ts-ignore
      return new Array(arrayLength).fill(getPayloadValue(value));
    }
    case ValueType.Tuple: {
      if (!Array.isArray(value)) {
        console.error('Value of type "Tuple" is not an array');

        return [];
      }

      return value.map(getPayloadValue);
    }
    case ValueType.Enum:
    case ValueType.Result: {
      if (!isPlainObject(value)) {
        console.error('Value of type "Enum" or "Result" is not an object');

        return {};
      }

      const [firstKey, firstValue] = Object.entries(value)[0];

      return {
        [firstKey]: getPayloadValue(firstValue),
      };
    }
    case ValueType.Struct: {
      if (!isPlainObject(value)) {
        console.error('Value of type "Enum", "Result", "Struct" is not an object');

        return {};
      }

      const structure = Object.entries(value).map((item) => {
        return [item[0], getPayloadValue(item[1])];
      });

      return Object.fromEntries(structure);
    }
    case ValueType.Null:
    case ValueType.Option: {
      return null;
    }
    case ValueType.BTreeMap: {
      if (!isPlainObject(value)) {
        console.error('Value of type "BTreeMap" is not an object');
      }

      return '{ }';
    }
    case ValueType.BTreeSet: {
      return '[ ]';
    }
    case ValueType.Primitive: {
      return '';
    }
    default:
      return null;
  }
};

export const getPayloadFormValues = (types?: string, typeName?: string): FormPayloadValues | undefined => {
  if (types && typeName) {
    const decodedTypes = decodeHexTypes(types);

    const typeStructure = createPayloadTypeStructure(typeName, decodedTypes);
    const manualPayload = createPayloadTypeStructure(typeName, decodedTypes, true);

    return {
      payload: getPayloadValue(typeStructure),
      manualPayload: getPreformattedText(manualPayload),
      typeStructure,
    };
  }
};
