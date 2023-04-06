import { GearJsonRPCError } from './base';

export class CodeNotFound extends GearJsonRPCError {
  name = 'CodeNotFound';
}

export class CodeHasNoMeta extends GearJsonRPCError {
  name = 'CodeHasNoMeta';
}
