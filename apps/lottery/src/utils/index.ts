import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from 'consts';
import { getStatus, getCountdown } from './status';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const isHex = (value: unknown) => {
  const hexRegex = /^0x[\da-fA-F]+/;

  return typeof value === 'string' && hexRegex.test(value);
};

const getNumber = (value: string) => +value.replaceAll(',', '');
const getDate = (value: number) => new Date(value).toLocaleString();

export { isLoggedIn, isHex, getNumber, getDate, getStatus, getCountdown };
