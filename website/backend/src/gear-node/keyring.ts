import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  signatureVerify,
} from '@polkadot/util-crypto';
import { Keypair } from '@polkadot/util-crypto/types';
import { isString } from 'class-validator';

export function keyringFromSuri(suri: string, name: string) {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyPair = keyring.addFromUri(suri, { name });
  return keyPair;
}

export function keyringFromKeyPair(pair: Keypair, name: string) {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromPair(pair, { name: name });
}

export function keyringFromJson(keypairJson: KeyringPair$Json | string) {
  const keyring = new Keyring({ type: 'sr25519' });
  const json = isString(keypairJson) ? JSON.parse(keypairJson) : keypairJson;
  return keyring.createFromJson(json);
}

export function keyringFromSeed(name: string, seed: Uint8Array | string) {
  const keyring = new Keyring({ type: 'sr25519' });
  const keypair = isHex(seed)
    ? keyring.addFromSeed(hexToU8a(seed), { name: name })
    : keyring.addFromSeed(seed, { name: name });
  return keypair;
}

export function keyringFromMnemonic(name: string, mnemonic: string) {
  const suri = `${mnemonic}//gear`;
  return keyringFromSuri(suri, `${name}`);
}

export function createKeyring(name: string) {
  const mnemonic = mnemonicGenerate();
  const seed = mnemonicToMiniSecret(mnemonic);
  const keyring = keyringFromSeed(name, seed);

  return {
    keyring: keyring,
    publicKey: keyring.address,
    seed: seed,
    json: keyring.toJson(),
  };
}

export function checkSign(keyPair: KeyringPair, message: string) {
  const signature = keyPair.sign(stringToU8a(message));
  if (signatureVerify(message, signature, keyPair.address).isValid) {
    return 'success';
  } else {
    return 'failed';
  }
}
