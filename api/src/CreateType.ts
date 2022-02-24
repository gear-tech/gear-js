import { splitByCommas } from './utils/string';
import { toJSON, isJSON } from './utils/json';
import { hexToU8a } from '@polkadot/util';
import { getTypesFromTypeDef, replaceNamespaces } from './create-type';

const REGULAR_EXP = {
  endWord: /\b\w+\b/g,
  angleBracket: /<.+>/,
  roundBracket: /^\(.+\)$/,
  squareBracket: /^\[.+\]$/,
};

const STD_TYPES = {
  Result: (ok, err) => {
    return {
      _enum_Result: {
        ok,
        err,
      },
    };
  },
  Option: (some) => {
    return {
      _enum_Option: some,
    };
  },
  Vec: (type) => {
    return [type];
  },
  VecDeque: (type) => {
    return [type];
  },
  BTreeMap: (key, value) => {
    return {
      [key]: value,
    };
  },
};

/**
 * @deprecated use `decodeHexTypes`
 */
export function parseHexTypes(hexTypes: string) {
  let { typesFromTypeDef, namespaces } = getTypesFromTypeDef(hexToU8a(hexTypes));
  const result = {};
  namespaces.forEach((value, key) => {
    const replaced = replaceNamespaces(typesFromTypeDef[value], namespaces);
    result[key] = isJSON(replaced) ? JSON.parse(replaced) : replaced;
  });
  return result;
}

/**
 * @deprecated will be removed in 0.16.0 version
 */
export function getTypeStructure(typeName: string, types: any) {
  if (!typeName) {
    return undefined;
  }
  // check tuples
  let match = typeName.match(REGULAR_EXP.roundBracket);
  if (match) {
    const entryType = match[0].slice(1, match[0].length - 1);
    const splitted = splitByCommas(entryType);
    return splitted.map((value) => getTypeStructure(value, types));
  }

  // check arrays
  match = typeName.match(REGULAR_EXP.squareBracket);
  if (match) {
    const splitted = typeName.slice(1, typeName.length - 1).split(';');
    return new Array(+splitted[1]).fill(getTypeStructure(splitted[0], types));
  }

  // check generic
  match = typeName.match(REGULAR_EXP.angleBracket);
  if (match) {
    const stdType = typeName.slice(0, match.index);
    if (stdType in STD_TYPES) {
      const entryType = match[0].slice(1, match[0].length - 1);
      const splitted = splitByCommas(entryType);
      return STD_TYPES[stdType](getTypeStructure(splitted[0], types), getTypeStructure(splitted[1], types));
    } else {
      return getTypeStructure(stdType, types);
    }
  }
  const type = isJSON(typeName) ? toJSON(JSON.stringify(types[typeName])) : types[typeName];

  // check custom types
  if (!type) {
    return typeName;
  }

  if (typeof type === 'object') {
    const result = {};
    Object.keys(type).forEach((key: string) => {
      if (key === '_enum') {
        result['_enum'] = type[key];
        Object.keys(result['_enum']).forEach((subKey: string) => {
          result['_enum'][subKey] = getTypeStructure(result['_enum'][subKey], types);
        });
      } else {
        result[key] =
          type[key] in types || type[key].match(REGULAR_EXP.angleBracket)
            ? getTypeStructure(type[key], types)
            : type[key];
      }
    });
    return result;
  } else {
    return type;
  }
}
