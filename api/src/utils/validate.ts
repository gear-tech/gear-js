import { BN, u8aToBigInt } from '@polkadot/util';
import { u128, u64 } from '@polkadot/types';

import { GasLimit, Hex, Value } from '../types';
import { CreateTypeError, ValidationError } from '../errors';
import { GearApi } from '../GearApi';

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

export async function validateCodeId(codeId: Hex, api: GearApi) {
  if (await api.code.exists(codeId)) {
    throw new ValidationError('Code already exists');
  }
}

export function checkTypeAndPayload(type: string, payload: unknown): string {
  if (payload === undefined) {
    throw new CreateTypeError('Payload is not specified');
  }
  return type || 'Bytes';
}
