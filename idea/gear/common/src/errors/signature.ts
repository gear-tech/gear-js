import { GearJsonRPCError } from './base';

export class SignatureNotVerified extends GearJsonRPCError {
  name = 'SignatureNotVerified';
}
