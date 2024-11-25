import { GearApi } from '../src';
import { WS_ADDRESS } from './config';

export function getApi() {
  return new GearApi({ providerAddress: WS_ADDRESS, noInitWarn: true });
}
