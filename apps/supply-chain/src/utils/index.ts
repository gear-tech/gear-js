import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isHex } from '@polkadot/util';
import { LOCAL_STORAGE } from 'consts';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const isValidHex = (value: string) => (!isHex(value) ? 'Address should be hex' : null);

export { isLoggedIn, isValidHex };
