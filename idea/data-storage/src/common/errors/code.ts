import { GearJsonRPCError } from './base';

export class CodeNotFound extends GearJsonRPCError {
  name = 'CodeNotFound';
}

export class CodeDoNotHaveMeta extends GearJsonRPCError {
  name = 'CodeDoNotHaveMeta';
}
