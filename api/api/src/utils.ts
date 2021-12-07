import { stringCamelCase, isHex } from '@polkadot/util';
import { Text } from '@polkadot/types';
import { Metadata } from './interfaces';
import { CreateType } from '.';

export function transformTypes(types: object): any {
  return Object.values(types).reduce((res, types): object => ({ ...res, ...types }), {});
}

export function toCamelCase(array: string[] | Text[]) {
  let result = stringCamelCase(array.join('_'));
  result = result.slice(0, 1).toUpperCase() + result.slice(1, result.length);
  return result;
}

export function isJSON(data: any) {
  try {
    JSON.parse(data);
  } catch (error) {
    try {
      if (JSON.stringify(data)[0] !== '{') {
        return false;
      }
    } catch (error) {
      return false;
    }
    return true;
  }
  return true;
}

export function toJSON(data: any) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

export function splitByCommas(str: string) {
  let counter = 0;
  let result = [];
  let lastTypeIndex = 0;
  try {
    Array.from(str).forEach((char, index) => {
      if (char === ',' && counter === 0) {
        result.push(str.slice(lastTypeIndex, index).trim());
        lastTypeIndex = index + 1;
      }
      (char === '<' || char === '(') && counter++;
      (char === '>' || char === ')') && counter--;
    });
    result.push(str.slice(lastTypeIndex).trim());
  } catch (_) {}
  return result;
}

export function createPayload(createType: CreateType, type: any, data: any, meta?: Metadata) {
  if (!data) {
    return '0x00';
  }
  let payload: string = data;
  if (meta && type) {
    const encoded = createType.create(type, data, meta);
    payload = isHex(encoded) ? encoded : encoded.toHex();
  }
  return payload;
}
