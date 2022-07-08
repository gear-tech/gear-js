import { getTypesFromTypeDef, replaceNamespaces } from './utils';
import { hexToU8a } from '@polkadot/util';
import { isJSON } from '../utils';

export function decodeHexTypes(hexTypes: string) {
  const { typesFromTypeDef, namespaces } = getTypesFromTypeDef(hexToU8a(hexTypes));
  const result = {};
  namespaces.forEach((value, key) => {
    const replaced = replaceNamespaces(typesFromTypeDef[value], namespaces);
    result[key] = isJSON(replaced) ? JSON.parse(replaced) : replaced;
  });
  return result;
}
