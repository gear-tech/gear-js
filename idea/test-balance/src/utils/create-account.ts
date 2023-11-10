import { GearKeyring } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';

export function createAccount(seed: string): Promise<KeyringPair> {
  if (seed.startsWith('//')) {
    return GearKeyring.fromSuri(seed);
  }
  if (seed.startsWith('0x')) {
    return GearKeyring.fromSeed(seed);
  }

  return GearKeyring.fromMnemonic(seed);
}
