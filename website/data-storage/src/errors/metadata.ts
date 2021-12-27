import { GearError } from './base';

export class MetadataNotFound extends GearError {
  name = 'MetadataNotFound';
  message = 'Metadata not found';
}
