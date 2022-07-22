import { signatureVerify } from '@polkadot/util-crypto';

export function signatureIsValid(publicKey: string, signature: string, message: string) {
  return signatureVerify(message, signature, publicKey).isValid;
}
