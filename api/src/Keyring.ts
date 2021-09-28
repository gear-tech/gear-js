import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { hexToU8a, isU8a, stringToU8a, isString, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToMiniSecret, signatureVerify } from '@polkadot/util-crypto';
import { Keypair } from '@polkadot/util-crypto/types';
import { waitReady } from '@polkadot/wasm-crypto';

export class GearKeyring {
  private static unlock(keyring: KeyringPair) {
    if (keyring.isLocked) {
      keyring.unlock();
    }
    return keyring;
  }

  static fromSuri(suri: string, name: string): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519' });
    const keyPair = keyring.addFromUri(suri, { name });
    return GearKeyring.unlock(keyPair);
  }

  static fromKeyPair(pair: Keypair, name: string): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519' });
    return GearKeyring.unlock(keyring.addFromPair(pair, { name: name }));
  }

  static fromJson(keypairJson: KeyringPair$Json | string): KeyringPair {
    const keyring = new Keyring({ type: 'sr25519' }).createFromJson(
      isString(keypairJson) ? JSON.parse(keypairJson) : keypairJson
    );
    return GearKeyring.unlock(keyring);
  }

  static async fromSeed(seed: Uint8Array | string, name: string): Promise<KeyringPair> {
    const keyring = new Keyring({ type: 'sr25519' });
    await waitReady();

    const keypair = isU8a(seed)
      ? keyring.addFromSeed(seed, { name: name })
      : keyring.addFromSeed(hexToU8a(seed), { name: name });
    return GearKeyring.unlock(keypair);
  }

  static fromMnemonic(mnemonic: string, name: string): KeyringPair {
    const suri = `${mnemonic}//gear`;
    return GearKeyring.fromSuri(suri, `${name}`);
  }

  static async create(name: string): Promise<{
    keyring: KeyringPair;
    mnemonic: string;
    seed: string;
    json: KeyringPair$Json;
  }> {
    const mnemonic = mnemonicGenerate();
    const seed = mnemonicToMiniSecret(mnemonic);
    const keyring = await GearKeyring.fromSeed(seed, name);

    return {
      keyring,
      mnemonic: mnemonic,
      seed: u8aToHex(seed),
      json: keyring.toJson()
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

  static checkSign(publicKey: string, signature: string, message: string) {
    if (signatureVerify(message, signature, publicKey).isValid) {
      return true;
    } else {
      return false;
    }
  }

  static sign(keyring: KeyringPair, message: string) {
    return keyring.sign(stringToU8a(message));
  }
}
