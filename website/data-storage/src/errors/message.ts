import { GearError } from './base';

export class MessageNotFound extends GearError {
  name = 'MessageNotFound';
  message = 'Message not found';
}
