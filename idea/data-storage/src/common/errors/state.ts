import { GearJsonRPCError } from './base';

export class StateNotFound extends GearJsonRPCError {
  name = 'StateNotFound';
}

export class StateAlreadyExists extends GearJsonRPCError {
  name = 'StateAlreadyExists';
}
