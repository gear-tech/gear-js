import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { Keypair } from '@polkadot/util-crypto/types';
export declare class GearKeyring {
  private static unlock;
  static fromSuri(suri: string, name?: string): KeyringPair;
  static fromKeyPair(pair: Keypair, name?: string): KeyringPair;
  static fromJson(keypairJson: KeyringPair$Json | string, passphrase?: string): KeyringPair;
  static fromSeed(seed: Uint8Array | string, name?: string): Promise<KeyringPair>;
  static fromMnemonic(mnemonic: string, name?: string): KeyringPair;
  static toJson(keyring: KeyringPair, passphrase?: string): KeyringPair$Json;
  static create(
    name: string,
    passphrase?: string,
  ): Promise<{
    keyring: KeyringPair;
    mnemonic: string;
    seed: string;
    json: KeyringPair$Json;
  }>;
  static generateMnemonic(): string;
  static generateSeed(mnemonic?: string): {
    seed: `0x${string}`;
    mnemonic: string;
  };
  static checkSign(publicKey: string, signature: string, message: string): boolean;
  static sign(keyring: KeyringPair, message: string): Uint8Array;
  static decodeAddress(publicKey: string): string;
  static encodeAddress(publicKeyRaw: string | Uint8Array): string;
  static checkPublicKey(publicKey: string): boolean;
}
