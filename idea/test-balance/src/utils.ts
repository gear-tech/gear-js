import { GearKeyring } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';

export function createAccount(seed: string): Promise<KeyringPair> {
  if (seed.startsWith('//')) {
    return GearKeyring.fromSuri(seed);
  } else {
    return GearKeyring.fromSeed(seed);
  }
}
