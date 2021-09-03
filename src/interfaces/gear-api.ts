import { GearType } from '@gear-js/interfaces';
import { KeyringPair$Json } from '@polkadot/keyring/types';

export interface GearApiOptions {
  providerAddress?: 'ws://127.0.0.1:9944';
  customTypes?: GearType;
}

export interface CreateKeyring {
  keyPairJson?: KeyringPair$Json | string;
  seed?: Uint8Array | string;
  mnemonic?: string;
  suri?: string;
}
