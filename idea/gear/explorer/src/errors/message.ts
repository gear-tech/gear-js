import { JsonRpcError } from '../types';

export class MessageNotFound implements JsonRpcError {
  code = -32404;
  message = 'Message not found';
}
