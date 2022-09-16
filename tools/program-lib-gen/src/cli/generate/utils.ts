import { stringCamelCase } from '@polkadot/util';

export function joinTypePath(path: string[]) {
  const camelCased = stringCamelCase(path.join('_'));
  return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1);
}
