import type { JsonRpcError } from '../types/index.js';

export class MessageNotFound implements JsonRpcError {
  code = -32404;
  message = 'Message not found';
}
