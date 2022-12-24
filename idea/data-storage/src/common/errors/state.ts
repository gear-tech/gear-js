import { GearJsonRPCError } from './base';

export class StateNotFound extends GearJsonRPCError {
  name = 'StateNotFound';
}
