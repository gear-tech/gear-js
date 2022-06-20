import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE, STATUS } from 'consts';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;
const isPending = (status: string) => status === STATUS.PENDING;

const isHex = (value: unknown) => {
  const hexRegex = /^0x[\da-fA-F]+/;

  return typeof value === 'string' && hexRegex.test(value);
};

const getUnix = (value: string) => +value.replaceAll(',', '');
const getDate = (value: number) => new Date(value).toLocaleString();

export { isLoggedIn, isPending, isHex, getUnix, getDate };
