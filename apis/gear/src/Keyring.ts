import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { hexToU8a, isString, isU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { Keypair } from '@polkadot/util-crypto/types';
import { Keyring } from '@polkadot/api';
import { waitReady } from '@polkadot/wasm-crypto';

import { decodeAddress } from './utils';
import { VARA_SS58_FORMAT } from './consts';

export class GearKeyring {
  private static unlock(keyring: KeyringPair, passphrase?: string) {
    if (keyring.isLocked) {
      keyring.unlock(passphrase);
    }
    return keyring;
  }

  static async fromSuri(suri: string, name?: string, ss58Format: number = VARA_SS58_FORMAT): Promise<KeyringPair> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format });
    await waitReady();
    const keyPair = keyring.addFromUri(suri, { name });
    return keyPair;
  }

  static fromKeyPair(pair: Keypair, name?: string, ss58Format: number = VARA_SS58_FORMAT): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519', ss58Format });
    return GearKeyring.unlock(keyring.addFromPair(pair, { name }));
  }

  static fromJson(
    keypairJson: KeyringPair$Json | string,
    passphrase?: string,
    ss58Format: number = VARA_SS58_FORMAT,
  ): KeyringPair {
    const json: KeyringPair$Json = isString(keypairJson) ? JSON.parse(keypairJson) : keypairJson;
    const keyring = new Keyring({ type: 'sr25519', ss58Format }).addFromJson(json);
    return GearKeyring.unlock(keyring, passphrase);
  }

  static async fromSeed(
    seed: Uint8Array | string,
    name?: string,
    ss58Format: number = VARA_SS58_FORMAT,
  ): Promise<KeyringPair> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format });
    await waitReady();

    const keypair = isU8a(seed) ? keyring.addFromSeed(seed, { name }) : keyring.addFromSeed(hexToU8a(seed), { name });
    return keypair;
  }

  static async fromMnemonic(
    mnemonic: string,
    name?: string,
    ss58Format: number = VARA_SS58_FORMAT,
  ): Promise<KeyringPair> {
    return await GearKeyring.fromSuri(mnemonic, name, ss58Format);
  }

  static toJson(keyring: KeyringPair, passphrase?: string): KeyringPair$Json {
    return keyring.toJson(passphrase);
  }

  static async create(
    name: string,
    passphrase?: string,
    ss58Format: number = VARA_SS58_FORMAT,
  ): Promise<{
    keyring: KeyringPair;
    mnemonic: string;
    seed: string;
    json: KeyringPair$Json;
  }> {
    const mnemonic = mnemonicGenerate();
    const seed = mnemonicToMiniSecret(mnemonic);
    const keyring = await GearKeyring.fromSeed(seed, name, ss58Format);
    return {
      keyring,
      mnemonic: mnemonic,
      seed: u8aToHex(seed),
      json: keyring.toJson(passphrase),
    };
  }

  static generateMnemonic(): string {
    return mnemonicGenerate();
  }

  static generateSeed(mnemonic?: string): { seed: `0x${string}`; mnemonic: string } {
    if (!mnemonic) {
      mnemonic = mnemonicGenerate();
    }
    return { seed: u8aToHex(mnemonicToMiniSecret(mnemonic)), mnemonic };
  }

  static sign(keyring: KeyringPair, message: string) {
    return keyring.sign(stringToU8a(message));
  }

  static checkPublicKey(publicKey: string): boolean {
    try {
      decodeAddress(publicKey);
    } catch (_) {
      return false;
    }
    return true;
  }
}
