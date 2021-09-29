import { GearApi } from '@gear-js/api';

let gear: Promise<GearApi> | null = null;

// Connecting to RPC node
export function initApi() {
  if (!gear) {
    gear = GearApi.create();
  }
  return gear;
}
