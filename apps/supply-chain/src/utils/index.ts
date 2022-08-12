import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isHex } from '@polkadot/util';
import { LOCAL_STORAGE } from 'consts';
import { getForm, getLabel, getName, getAction } from './form';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const isValidHex = (value: string) => (!isHex(value) ? 'Address should be hex' : null);
const isExists = (value: string) => (!value ? 'Field is required' : null);

export { isLoggedIn, isValidHex, isExists, getForm, getLabel, getName, getAction };
