import { GasInfo } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { bnToBn } from '@polkadot/util';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage.account === address;

const getAutoGasLimit = ({ waited, min_limit }: GasInfo) =>
  waited ? min_limit.add(min_limit.mul(bnToBn(0.1))) : min_limit;

const withoutCommas = (value: string) => value.replace(/,/g, '');

export { isLoggedIn, getAutoGasLimit, withoutCommas };
