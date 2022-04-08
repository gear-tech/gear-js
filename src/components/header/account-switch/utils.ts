import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// TODO: 'account' to consts
const isLoggedIn = ({ address }: InjectedAccountWithMeta) =>
  localStorage.getItem('account') === address;

export default isLoggedIn;
