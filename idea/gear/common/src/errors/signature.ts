import { GearJsonRPCError } from './base.js';

export class SignatureNotVerified extends GearJsonRPCError {
  name = 'SignatureNotVerified';
}
