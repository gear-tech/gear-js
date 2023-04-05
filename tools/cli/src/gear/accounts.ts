import { GearApi } from '@gear-js/api';
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a, isHex } from '@polkadot/util';
import { logger } from '../utils';

export function getAccounts(accounts: Record<string, string>) {
  const keyringType = 'sr25519';
  const keyring = new Keyring({ type: keyringType });
  const result: Record<string, KeyringPair> = {};
  Object.entries(accounts).forEach(([name, seed]) => {
    if (seed.startsWith('//')) {
      result[name] = keyring.addFromUri(seed) as KeyringPair;
    } else if (isHex(seed)) {
      result[name] = keyring.addFromSeed(hexToU8a(seed), {}, keyringType) as KeyringPair;
    } else {
      result[name] = keyring.addFromMnemonic(seed, {}, keyringType) as KeyringPair;
    }
    logger.info(`Set account ${name} to ${result[name].address}`, { lvl: 1 });
  });
  console.log();
  return result;
}

export async function fundAccounts(
  api: GearApi,
  accounts: Record<string, KeyringPair>,
  prefunded: string,
  fundAccounts: Record<string, number>,
) {
  const txs = Object.entries(fundAccounts).map(([name, value]) => api.balance.transfer(accounts[name].address, value));
  return new Promise((resolve) => {
    api.tx.utility.batchAll(txs).signAndSend(accounts[prefunded], (result) => {
      result.status.isFinalized && resolve('ok');
    });
  });
}
