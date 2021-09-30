import { GearApi } from '@gear-js/api';
import { API_CONNECTION_ADDRESS } from '../consts';

let gear: Promise<GearApi> | null = null;

// Connecting to RPC node
export function initApi() {
  if (!gear) {
    gear = GearApi.create({
      providerAddress: API_CONNECTION_ADDRESS,
    });
  }
  return gear;
}
