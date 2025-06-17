import { ApiPromise } from '@polkadot/api';

export function getExtrinsic(api: ApiPromise, section: string, method: string, args: any[]) {
  return api.tx[section][method](...args);
}
