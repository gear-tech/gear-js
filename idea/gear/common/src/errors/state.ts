import { GearJsonRPCError } from './base.js';

export class StateNotFound extends GearJsonRPCError {
  name = 'StateNotFound';
}

export class StateAlreadyExists extends GearJsonRPCError {
  name = 'StateAlreadyExists';
}
