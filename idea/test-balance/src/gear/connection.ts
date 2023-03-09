import { GearApi } from '@gear-js/api';
import { initLogger } from '@gear-js/common';

import { changeStatus } from '../routes/healthcheck.router';
import config from '../config/configuration';
import { producer } from '../rabbitmq/producer';

const logger = initLogger('TEST_BALANCE_GEAR');

export let api: GearApi;

const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

export async function connect() {
  api = new GearApi({ providerAddress: config.gear.providerAddress });

  try {
    await api.isReadyOrError;
  } catch (error) {
    logger.error(`Failed to connect to ${config.gear.providerAddress}`);
  }
  await api.isReady;
  api.on('disconnected', () => {
    reconnect();
  });

  logger.info(`Connected to ${await api.chain()} with genesis ${getGenesisHash()}`);
  changeStatus('ws');
}

async function reconnect(): Promise<void> {
  if (api) {
    await api.disconnect();
    api = null;
  }
  reconnectionsCounter++;
  if (reconnectionsCounter > MAX_RECONNECTIONS) {
    throw new Error(`Unable to connect to ${config.gear.providerAddress}`);
  }
  logger.info('⚙️ 📡 Reconnecting to the gear node');
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  api && producer.sendDeleteGenesis(getGenesisHash());
  changeStatus('ws');
  return connect();
}

export function getGenesisHash(): string {
  return api.genesisHash.toHex();
}
