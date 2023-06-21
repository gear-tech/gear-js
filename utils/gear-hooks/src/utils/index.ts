import { decodeAddress, GasInfo } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { bnToBn } from '@polkadot/util';
import { Account } from 'types';

const getBalance = (balance: Balance) => {
  const [value, unit] = balance.toHuman().split(' ');
  return { value, unit };
};

const getAccount = (account: InjectedAccountWithMeta, balance: Balance): Account => ({
  ...account,
  balance: getBalance(balance),
  decodedAddress: decodeAddress(account.address),
});

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage.account === address;

const getAutoGasLimit = ({ waited, min_limit }: GasInfo) =>
  waited ? min_limit.add(min_limit.mul(bnToBn(0.1))) : min_limit;

const withoutCommas = (value: string) => value.replace(/,/g, '');

export { getBalance, getAccount, isLoggedIn, getAutoGasLimit, withoutCommas };
