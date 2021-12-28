import { GearError } from './base';

export class ProgramNotFound extends GearError {
  name = 'ProgramNotFound';
  message = 'Program not found';
}
