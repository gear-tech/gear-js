import { Text } from '@polkadot/types';
import { stringCamelCase } from '@polkadot/util';

export function toCamelCase(array: string[] | Text[]): string {
  let result = stringCamelCase(array.join('_'));
  result = result.slice(0, 1).toUpperCase() + result.slice(1, result.length);
  return result;
}
