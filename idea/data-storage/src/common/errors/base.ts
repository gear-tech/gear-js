export class GearJsonRPCError extends Error {
  name = 'GearJsonRPCError';
  constructor(data?: string) {
    super(data);
  }
}
