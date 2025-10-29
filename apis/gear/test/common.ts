import { GearApi } from '../src';
import { WS_ADDRESS } from './config';

export function getApi(noInitWarn?: boolean) {
  return new GearApi({ providerAddress: WS_ADDRESS, noInitWarn });
}
