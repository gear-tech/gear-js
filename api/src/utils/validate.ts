import { BN, u8aToBigInt } from '@polkadot/util';
import { u128 } from '@polkadot/types';

import { ValidationError } from '../errors';
import { GearApi } from '../GearApi';
import { Value } from '../types';

export function validateValue(value: Value | undefined, api: GearApi) {
  if (value === undefined) return;

  const existentialDeposit = api.existentialDeposit;

  const bigintValue =
    value instanceof Uint8Array
      ? u8aToBigInt(value)
      : value instanceof u128 || value instanceof BN
      ? BigInt(value.toString())
      : BigInt(value);

  if (bigintValue > 0 && bigintValue < existentialDeposit.toBigInt()) {
    throw new ValidationError(`Value should be 0 or more than ${existentialDeposit.toString()}`);
  }
}
