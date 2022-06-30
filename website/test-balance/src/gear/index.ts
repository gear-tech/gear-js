import { GearApi, GearKeyring, TransferData } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { initLogger } from '@gear-js/common';

import config from '../config/configuration';
import { ResponseTransferBalance } from './types';
import { transferService } from '../services/transfer/transfer.service';

let gearApi: GearApi;
let accountGR: KeyringPair;
let rootAccountGR: KeyringPair;
let accountBalanceGR: BN;
let balanceToTransferGR: BN;

const logger = initLogger('TEST_BALANCE_GEAR');

async function connect() {
  gearApi = await GearApi.create({ providerAddress: config.gear.providerAddress });
  gearApi.on('error', () => {
    GearApi.create({ providerAddress: config.gear.providerAddress }).then(
      (newApi) => {
        gearApi = newApi;
      },
      (error) => {
        logger.error(`Could not reconnect error: ${error}`);
        throw error;
      },
    );
  });
  logger.info(`Connected to ${await gearApi.chain()} with genesis ${getGenesisHash()}`);

  const [account, rootAccountByGearKeyring] = await Promise.all([
    GearKeyring.fromSeed(config.gear.accountSeed),
    setRootAccountSeedByGearKeyring(),
  ]);

  accountGR = account;
  rootAccountGR = rootAccountByGearKeyring;
  accountBalanceGR = new BN(config.gear.accountBalance);
  balanceToTransferGR = new BN(config.gear.balanceToTransfer);

  if (await isSmallAccountBalance()) {
    await transferBalance(accountGR.address, rootAccountGR, accountBalanceGR);
  }
}

async function transferBalance(
  to: string,
  from: KeyringPair = accountGR,
  balance: BN = balanceToTransferGR,
): Promise<ResponseTransferBalance> {
  try {
    await transfer(from, to, balance);
  } catch (error) {
    logger.error(error);
    return { error: `Transfer balance from ${from} to ${to} failed` };
  }
  if (to !== accountGR.address) {
    await transferService.setTransferDate(to, getGenesisHash());
  }
  return { status: 'ok', transferredBalance: balance.toString() };
}

async function transfer(from: KeyringPair = accountGR, to: string, balance: BN): Promise<TransferData> {
  gearApi.balance.transfer(to, balance);
  return new Promise((resolve, reject) => {
    gearApi.balance.signAndSend(from, ({ events }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'Transfer') {
          resolve(data as TransferData);
        } else if (method === 'ExtrinsicFailed') {
          reject(data);
        }
      });
    });
  });
}

async function setRootAccountSeedByGearKeyring(): Promise<KeyringPair> {
  const envVar = config.gear.rootAccountSeed;
  if (envVar === '//Alice') {
    return GearKeyring.fromSuri('//Alice');
  } else {
    return GearKeyring.fromSeed(config.gear.rootAccountSeed);
  }
}

async function isSmallAccountBalance(): Promise<boolean> {
  const balance = await gearApi.balance.findOut(accountGR.address);
  if (balance.lt(accountBalanceGR)) {
    return true;
  }
  return false;
}

function getGenesisHash(): string {
  return gearApi.genesisHash.toHex();
}

export const gearService = { connect, getGenesisHash, transferBalance };
