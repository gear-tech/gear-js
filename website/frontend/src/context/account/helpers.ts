import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Balance } from '@polkadot/types/interfaces';
import { GearKeyring } from '@gear-js/api';

export const getBalance = (balance: Balance) => {
  const [value, unit] = balance.toHuman().split(' ');

  return { value, unit };
};

export const getAccount = (account: InjectedAccountWithMeta, balance: Balance) => ({
  ...account,
  balance: getBalance(balance),
  decodedAddress: GearKeyring.decodeAddress(account.address),
});
