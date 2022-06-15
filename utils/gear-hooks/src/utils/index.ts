import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { GearKeyring } from '@gear-js/api';
import { Balance } from '@polkadot/types/interfaces';

const getBalance = (balance: Balance) => {
  const [value, unit] = balance.toHuman().split(' ');
  return { value, unit };
};

const getAccount = (_account: InjectedAccountWithMeta, balance: Balance) => ({
  ..._account,
  balance: getBalance(balance),
  decodedAddress: GearKeyring.decodeAddress(_account.address),
});

export { getBalance, getAccount };
