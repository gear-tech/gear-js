import { CreateTypeError } from '../errors';
import { stringCamelCase } from '@polkadot/util';

export function typeIsString(type: string): boolean {
  return ['string', 'utf8', 'utf-8', 'text'].includes(type.toLowerCase());
}

export function checkTypeAndPayload(type: string, payload: unknown): string {
  if (payload === undefined) {
    throw new CreateTypeError('Payload is not specified');
  }
  return type || 'Bytes';
}

export function joinTypePath(path: string[]) {
  const camelCased = stringCamelCase(path.join('_'));
  return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1);
}
