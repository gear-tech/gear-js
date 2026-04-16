import type { JsonRpcError } from '../types/index.js';

export class ProgramNotFound implements JsonRpcError {
  code = -32404;
  message = 'Program not found';
}
