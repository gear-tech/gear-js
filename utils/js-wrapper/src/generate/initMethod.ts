import { Target } from 'interfaces';

export function generateInitMethod(target: Target) {
  return `  async init() {
    if (this.api === undefined) {
      this.api = await GearApi.create({ providerAddress: this.providerAddress });
    }
    this.mod = await rust;
    ${target === 'web' ? `await this.mod.default();` : ''}
  }`;
}
