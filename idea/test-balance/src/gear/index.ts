import { TransferData } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { initLogger } from '@gear-js/common';

import config from '../config/configuration';
import { ResponseTransferBalance } from './types';
import { transferService } from '../services/transfer.service';
import { createAccount } from './utils';
import { connect, api, getGenesisHash } from './connection';

let tbAccount: KeyringPair;
let prefundedAcc: KeyringPair;
let tbAccBalance: BN;
let balanceToTransfer: BN;

const logger = initLogger('TEST_BALANCE_GEAR');

async function init() {
  tbAccount = await createAccount(config.gear.accountSeed);
  prefundedAcc = await createAccount(config.gear.rootAccountSeed);
  tbAccBalance = new BN(config.gear.accountBalance);
  balanceToTransfer = new BN(config.gear.balanceToTransfer);

  await connect();

  if (await isSmallAccountBalance()) {
    await transferBalance(tbAccount.address, prefundedAcc, tbAccBalance);
  }
}

async function transferBalance(
  to: string,
  from: KeyringPair = tbAccount,
  balance: BN = balanceToTransfer,
): Promise<ResponseTransferBalance> {
  logger.info(`Transfer value ${balance.toNumber()} from ${from.address} to ${to}`);
  try {
    await transfer(to, from, balance);
  } catch (error) {
    logger.error(error);
    return { error: `Transfer balance from ${from} to ${to} failed` };
  }
  if (to !== tbAccount.address) {
    await transferService.setTransferDate(to, getGenesisHash());
  }
  return { status: 'ok', transferredBalance: balance.toString() };
}

async function transfer(
  to: string,
  from: KeyringPair = tbAccount,
  balance: BN = balanceToTransfer,
): Promise<TransferData> {
  const tx = api.balance.transfer(to, balance);
  return new Promise((resolve, reject) => {
    tx.signAndSend(from, ({ events }) => {
      events.forEach(({ event }) => {
        const { method, data } = event;
        if (method === 'Transfer') {
          resolve(data as TransferData);
        } else if (method === 'ExtrinsicFailed') {
          reject(api.getExtrinsicFailedError(event).docs.filter(Boolean).join('. '));
        }
      });
    });
  });
}

async function isSmallAccountBalance(): Promise<boolean> {
  const balance = await api.balance.findOut(tbAccount.address);
  if (balance.lt(tbAccBalance)) {
    return true;
  }
  return false;
}

export const gearService = { init, getGenesisHash, transferBalance };
