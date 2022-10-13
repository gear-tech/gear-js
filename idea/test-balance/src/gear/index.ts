import { GearApi, TransferData } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { initLogger } from '@gear-js/common';

import config from '../config/configuration';
import { ResponseTransferBalance } from './types';
import { transferService } from '../services/transfer.service';
import { createAccount } from './utils';
import { changeStatus } from '../routes/healthcheck.router';

let api: GearApi;
let accountGR: KeyringPair;
let rootAccountGR: KeyringPair;
let accountBalanceGR: BN;
let balanceToTransferGR: BN;

const logger = initLogger('TEST_BALANCE_GEAR');

async function connect() {
  api = await GearApi.create({ providerAddress: config.gear.providerAddress });
  changeStatus('ws');
  logger.info(`Connected to ${await api.chain()} with genesis ${getGenesisHash()}`);

  accountGR = await createAccount(config.gear.accountSeed);
  rootAccountGR = await createAccount(config.gear.rootAccountSeed);

  accountBalanceGR = new BN(config.gear.accountBalance);
  balanceToTransferGR = new BN(config.gear.balanceToTransfer);

  if (await isSmallAccountBalance()) {
    await transferBalance(accountGR.address, rootAccountGR, accountBalanceGR);
  }

  return new Promise((resolve) =>
    api.on('error', (error) => {
      changeStatus('ws');
      resolve(error);
    }),
  );
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
  api.balance.transfer(to, balance);
  return new Promise((resolve, reject) => {
    api.balance.signAndSend(from, ({ events }) => {
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

async function isSmallAccountBalance(): Promise<boolean> {
  const balance = await api.balance.findOut(accountGR.address);
  if (balance.lt(accountBalanceGR)) {
    return true;
  }
  return false;
}

function getGenesisHash(): string {
  return api.genesisHash.toHex();
}

export const gearService = { connect, getGenesisHash, transferBalance };
