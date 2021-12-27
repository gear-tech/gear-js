export class GearError extends Error {
  name = 'Gear Error';
  constructor(message?: string) {
    super(message);
  }
}
