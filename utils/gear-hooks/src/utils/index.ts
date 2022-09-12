import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { GasInfo, GearKeyring } from '@gear-js/api';
import { Balance } from '@polkadot/types/interfaces';
import { Account } from 'types';

const getBalance = (balance: Balance) => {
  const [value, unit] = balance.toHuman().split(' ');
  return { value, unit };
};

const getAccount = (account: InjectedAccountWithMeta, balance: Balance): Account => ({
  ...account,
  balance: getBalance(balance),
  decodedAddress: GearKeyring.decodeAddress(account.address),
});

export { getBalance, getAccount };
