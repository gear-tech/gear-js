import { KeyringPair$Json } from '@polkadot/keyring/types';
export interface CreateKeyring {
    keyPairJson?: KeyringPair$Json | string;
    seed?: Uint8Array | string;
    mnemonic?: string;
    suri?: string;
}
