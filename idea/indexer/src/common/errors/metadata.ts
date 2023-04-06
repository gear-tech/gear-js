import { GearJsonRPCError } from './base';

export class MetadataNotFound extends GearJsonRPCError {
  name = 'MetadataNotFound';
}

export class InvalidMetaHex extends GearJsonRPCError {
  name = 'InvalidMetaHex';
}
