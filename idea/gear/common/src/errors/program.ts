import { GearJsonRPCError } from './base.js';

export class ProgramNotFound extends GearJsonRPCError {
  name = 'ProgramNotFound';
}
