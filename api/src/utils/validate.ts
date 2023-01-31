import { BN, u8aToBigInt } from '@polkadot/util';
import { u128, u64 } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

import { GasLimit, Value } from '../types';
import { GearApi } from '../GearApi';
import { ValidationError } from '../errors';

export function validateValue(value: Value | undefined, api: GearApi) {
  if (!value) return;

  const existentialDeposit = api.existentialDeposit;

  const bigintValue =
    value instanceof Uint8Array
      ? u8aToBigInt(value)
      : value instanceof u128 || value instanceof BN
      ? BigInt(value.toString())
      : BigInt(value);

  if (bigintValue > 0 && bigintValue < existentialDeposit.toBigInt()) {
    throw new ValidationError(`Value less than minimal. Minimal value: ${existentialDeposit.toHuman()}`);
  }
}

export function validateGasLimit(gas: GasLimit, api: GearApi) {
  if (gas === undefined) throw new ValidationError("Gas limit doesn't specified");
  const bigintGas =
    gas instanceof Uint8Array
      ? u8aToBigInt(gas)
      : gas instanceof u64 || gas instanceof BN
      ? BigInt(gas.toString())
      : BigInt(gas);
  if (bigintGas > api.blockGasLimit.toBigInt()) {
    throw new ValidationError(`GasLimit too high. Maximum gasLimit value is ${api.blockGasLimit.toHuman()}`);
  }
}

export async function validateCodeId(codeId: HexString, api: GearApi) {
  if (await api.code.exists(codeId)) {
    throw new ValidationError('Code already exists');
  }
}
