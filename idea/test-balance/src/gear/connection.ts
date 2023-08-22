import { GearApi, HexString } from '@gear-js/api';
import { logger } from '@gear-js/common';

import { changeStatus } from '../healthcheck.router';
import config from '../config/configuration';
import { producer } from '../rabbitmq/producer';

export let api: GearApi;
let genesisHash: HexString;

const addresses = config.gear.providerAddresses;
// max number of reconnections for each node address
const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

let providerAddress = addresses[0];

export async function connect() {
  if (!providerAddress) {
    throw new Error('There are no node addresses to connect to');
  }

  api = new GearApi({ providerAddress });

  try {
    await api.isReadyOrError;
  } catch (error) {
    logger.error(`Failed to connect to ${providerAddress}`, { error });
    await reconnect();
  }
  await api.isReady;
  api.on('disconnected', () => {
    producer.sendDeleteGenesis(genesisHash);
    reconnect();
  });
  genesisHash = api.genesisHash.toHex();
  logger.info(`Connected to ${await api.chain()} with genesis ${genesisHash}`);
  changeStatus('ws');
}

async function reconnect(): Promise<void> {
  if (api) {
    await api.disconnect();
    api = null;
  }

  reconnectionsCounter++;
  if (reconnectionsCounter > MAX_RECONNECTIONS) {
    providerAddress = addresses.filter((address) => address !== providerAddress)[0];
    reconnectionsCounter = 0;
  }

  logger.info('Attempting to reconnect');
  changeStatus('ws');
  return connect();
}

export function getGenesisHash() {
  return genesisHash;
}
