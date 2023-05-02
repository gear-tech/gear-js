import { GearJsonRPCError } from './base';

export class MetadataNotFound extends GearJsonRPCError {
  name = 'MetadataNotFound';
}

export class MetaAlreadyExists extends GearJsonRPCError {
  name = 'MetaAlreadyExists';
}
