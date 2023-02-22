export class GearJsonRPCError extends Error {
  name = 'GearJsonRPCError';
  constructor(data?: string) {
    super(data);
  }
}

export class InvalidMetaHex extends GearJsonRPCError {
  name = 'InvalidMetaHex';
}
