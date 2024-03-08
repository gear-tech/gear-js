import { GearApi } from '@gear-js/api';
import { RMQServiceAction, logger } from '@gear-js/common';

import config from '../config';
import { changeStatus } from '../healthcheck.server';
import { GearIndexer } from './indexer';

const addresses = config.gear.providerAddresses;

// max number of reconnections for each node address
const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

type GenesisCb = (action: RMQServiceAction, genesis: string) => void;
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

  const genesis = api.genesisHash.toHex();

  logger.info(`Connected to ${api.runtimeChain} with genesis ${genesis}`);

  api.on('disconnected', () => {
    logger.warn('Disconnected from the node.');
    indexer.stop();
    genesis && cb(RMQServiceAction.DELETE, genesis);
    reconnect(api, indexer, cb);
  });

  reconnectionsCounter = 0;
  await indexer.run(api);
  cb(RMQServiceAction.ADD, genesis);
  changeStatus('gear');
}

async function reconnect(api: GearApi, indexer: GearIndexer, cb: GenesisCb) {
  changeStatus('gear', false);

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  try {
    await api.disconnect();
  } catch (error) {
    logger.error('Disconnected from the node1', { error });
  }
  reconnectionsCounter++;

  if (reconnectionsCounter === MAX_RECONNECTIONS) {
    providerAddress = addresses.filter((address) => address !== providerAddress)[0];
    reconnectionsCounter = 0;
  }

  logger.info('Attempting to reconnect');

  return connectToNode(indexer, cb);
}
