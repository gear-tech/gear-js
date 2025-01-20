import { REGULAR_EXP } from './regexp';

export function transformTypes(types: object): { [key: string]: object } {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}

export function convertString(string: string) {
  const wordsArray = string
    .replace(/[_:, .]+/g, ' ')
    .trim()
    .split(' ');
  return wordsArray.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

export function joinTypePath(path: string[]) {
  return convertString(path.join('_'));
}

export function typeIsGeneric(type: string) {
  const matches = type.match(REGULAR_EXP.generic);
  if (matches) {
    return true;
  } else {
    return false;
  }
}

export function typeIsString(type: string): boolean {
  return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase());
}

export function getTypeAndPayload(type: string, payload: unknown): [string, unknown] {
  if (payload === undefined) {
    payload = '0x';
  }
  if (type === undefined) {
    type = 'Bytes';
  }
  return [type, payload];
}
