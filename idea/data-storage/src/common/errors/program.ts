import { GearJsonRPCError } from './base';

export class ProgramNotFound extends GearJsonRPCError {
  name = 'ProgramNotFound';
}

export class InvalidProgramMetaHex extends GearJsonRPCError {
  name = 'InvalidProgramMetaHex';
}
