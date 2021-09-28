import { GearApi } from '@gear-js/api';

// Connecting to RPC node
export async function initApi() {
  const gear = await GearApi.create();
  return gear;
}
