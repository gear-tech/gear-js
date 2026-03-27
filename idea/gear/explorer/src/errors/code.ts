import { JsonRpcError } from '../types/index.js';

export class CodeNotFound implements JsonRpcError {
  code = -32404;
  message = 'Code not found';
}
