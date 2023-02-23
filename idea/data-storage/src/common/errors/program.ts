import { GearJsonRPCError } from './base';

export class ProgramNotFound extends GearJsonRPCError {
  name = 'ProgramNotFound';
}

export class ProgramHasNoMeta extends GearJsonRPCError {
  name = 'ProgramHasNoMeta';
}
