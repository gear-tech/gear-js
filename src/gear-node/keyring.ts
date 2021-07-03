import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  naclKeypairFromSeed,
  signatureVerify,
} from '@polkadot/util-crypto';
import { Keypair } from '@polkadot/util-crypto/types';
import { User } from 'src/users/entities/user.entity';

export function keyringFromSuri(suri: string, name: string) {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyPair = keyring.addFromUri(suri, { name });
  return keyPair;
}

export function keyringFromKeyPair(pair: Keypair, name: string) {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromPair(pair, { name: name });
}

export function keyringFromJson(json: KeyringPair$Json) {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.createFromJson(json);
}

export function keyringFromSeed(user: User, seed: Uint8Array | string) {
  const keyring = new Keyring({ type: 'sr25519' });
  const keypair = isHex(seed)
    ? keyring.addFromSeed(hexToU8a(seed), { name: user.username })
    : keyring.addFromSeed(seed);
  return keypair;
}

export function keyringFromMnemonic(user: User, mnemonic: string) {
  const suri = `${mnemonic}//gear`;
  return keyringFromSuri(suri, `${user.name}`);
}

export function createKeyring(user: User) {
  const mnemonic = mnemonicGenerate();
  const seed = mnemonicToMiniSecret(mnemonic);
  // const keyPair = naclKeypairFromSeed(seed);
  const keyring = keyringFromSeed(user, seed);

  return {
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
