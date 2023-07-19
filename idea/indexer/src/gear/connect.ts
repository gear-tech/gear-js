import { GearApi } from '@gear-js/api';
import { RMQServiceActions } from '@gear-js/common';

import config from '../config';
import { changeStatus } from '../healthcheck';
import { logger } from '../common';
import { GearIndexer } from './indexer';

const addresses = config.gear.providerAddresses;

// max number of reconnections for each node address
const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

type GenesisCb = (action: RMQServiceActions, genesis: string) => void;
let providerAddress = addresses[0];

export async function connectToNode(indexer: GearIndexer, cb: GenesisCb) {
  if (!providerAddress) {
    throw new Error('There are no node addresses to connect to');
  }

  const api = new GearApi({ providerAddress });

  try {
    await api.isReadyOrError;
  } catch (error) {
    logger.error(`Failed to connect to ${providerAddress}`);
    indexer.stop();
    await reconnect(api, indexer, cb);
  }
  await api.isReady;
  const genesis = api.genesisHash.toHex();

  api.on('disconnected', () => {
    indexer.stop();
    genesis && cb(RMQServiceActions.DELETE, genesis);
    reconnect(api, indexer, cb);
  });

  reconnectionsCounter = 0;
  await indexer.run(api);
  cb(RMQServiceActions.ADD, genesis);
  logger.info(`⚙️ Connected to ${api.runtimeChain} with genesis ${genesis}`);
  changeStatus('gear');
}

async function reconnect(api: GearApi, indexer: GearIndexer, cb: GenesisCb) {
  changeStatus('gear', false);

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  try {
    await api.disconnect();
  } catch (err) {
    console.log(err);
  }
  reconnectionsCounter++;

  if (reconnectionsCounter === MAX_RECONNECTIONS) {
    providerAddress = addresses.filter((address) => address !== providerAddress)[0];
    reconnectionsCounter = 0;
  }

  logger.info('⚙️ 📡 Reconnecting to the gear node...');

  return connectToNode(indexer, cb);
}
