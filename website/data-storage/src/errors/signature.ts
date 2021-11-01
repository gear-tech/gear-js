import { GearError } from './base';

export class SignNotVerified extends GearError {
  name = 'SignatureNotVerified';
  message = 'Signature not verified';
}
