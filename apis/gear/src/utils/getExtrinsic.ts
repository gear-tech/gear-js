import { GearApi } from 'GearApi';

export function getExtrinsic(api: GearApi, section: string, method: string, args: any[]) {
  return api.tx[section][method](...args);
}
