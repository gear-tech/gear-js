import { GearApi } from '@gear-js/api';

import { changeStatus } from '../routes/healthcheck.router';
import config from '../config/configuration';
import { producer } from '../rabbitmq/producer';
import { logger } from '../common/logger';

export let api: GearApi;

let addresses = config.gear.providerAddresses;
const MAX_RECONNECTIONS = 10; //max count reconnection for each provider address
let reconnectionsCounter = 0;
let providerAdd = addresses[0];
let connectionStatus = false;

export async function connect() {
  if (!providerAdd) {
    throw new Error('Not found provider address to connect');
  }

  api = new GearApi({ providerAddress: providerAdd });

  try {
    await api.isReadyOrError;
    connectionStatus = true;
  } catch (error) {
    logger.error(`Failed to connect to ${providerAdd}`);
    await retryConnectionToNode();
  }
  await api.isReady;
  api.on('disconnected', () => {
    connectionStatus = false;
    producer.sendDeleteGenesis(getGenesisHash());
    retryConnectionToNode();
  });

  connectionStatus = true;
  logger.info(`Connected to ${await api.chain()} with genesis ${getGenesisHash()}`);
  changeStatus('ws');
}

async function retryConnectionToNode() {
  if (addresses.length === 0) throw new Error(`️ 📡 Unable to connect node providers 🔴`);

  if (connectionStatus) return;

  for (let i = 0; i <= addresses.length; i + 1) {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    await reconnect();
  }
}

async function reconnect(): Promise<void> {
  if (connectionStatus) {
    reconnectionsCounter = 0;
    addresses = config.gear.providerAddresses;
    producer.sendGenesis(getGenesisHash());
    return;
  }

  if (api) {
    await api.disconnect();
    api = null;
  }

  reconnectionsCounter++;
  if (reconnectionsCounter > MAX_RECONNECTIONS) {
    addresses = addresses.filter((address) => address !== providerAdd);
    providerAdd = addresses[0];
    reconnectionsCounter = 0;
  }

  logger.info('⚙️ 📡 Reconnecting to the gear node 🟡');
  changeStatus('ws');
  return connect();
}

export function getGenesisHash(): string {
  return api.genesisHash.toHex();
}
