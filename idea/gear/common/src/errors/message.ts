import { GearJsonRPCError } from './base';

export class MessageNotFound extends GearJsonRPCError {
  name = 'MessageNotFound';
}
