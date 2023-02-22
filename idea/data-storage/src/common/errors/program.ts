import { GearJsonRPCError } from './base';

export class ProgramNotFound extends GearJsonRPCError {
  name = 'ProgramNotFound';
}

export class ProgramDoNotHaveMeta extends GearJsonRPCError {
  name = 'ProgramDoNotHaveMeta';
}
