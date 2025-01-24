import { JsonRpcError } from '../types';

export class CodeNotFound implements JsonRpcError {
  code = -32404;
  message = 'Code not found';
}
