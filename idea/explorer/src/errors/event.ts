import { JsonRpcError } from '../types';

export class EventNotFound implements JsonRpcError {
  code = -32404;
  message = 'Event not found';
}
