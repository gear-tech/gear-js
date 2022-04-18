import { GearJsonRPCError } from './base';

export class ProgramNotFound extends GearJsonRPCError {
  name = 'ProgramNotFound';
}
