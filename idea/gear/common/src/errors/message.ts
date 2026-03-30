import { GearJsonRPCError } from './base.js';

export class MessageNotFound extends GearJsonRPCError {
  name = 'MessageNotFound';
}
