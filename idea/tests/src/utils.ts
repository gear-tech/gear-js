import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';

export function sleep(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });
}

export function getAccounts(): { alice: KeyringPair; bob: KeyringPair } {
  const keyring = new Keyring({ type: 'sr25519' });
  return { alice: keyring.addFromUri('//Alice'), bob: keyring.addFromUri('//Bob') };
}
