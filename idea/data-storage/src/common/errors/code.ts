import { GearJsonRPCError } from './base';

export class CodeNotFound extends GearJsonRPCError {
  name = 'CodeNotFound';
}

export class InvalidCodeMetaHex extends GearJsonRPCError {
  name = 'InvalidCodeMetaHex';
}
