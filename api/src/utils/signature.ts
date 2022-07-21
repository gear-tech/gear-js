import { signatureVerify } from '@polkadot/util-crypto';

export function signatureIsValid(publicKey: string, signature: string, message: string) {
  if (signatureVerify(message, signature, publicKey).isValid) {
    return true;
  } else {
    return false;
  }
}
