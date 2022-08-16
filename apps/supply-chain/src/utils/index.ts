import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from 'consts';
import { getForm, getLabel, getName, getAction, isValidHex, isExists } from './form';
import { getItemData } from './item';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

export { isLoggedIn, isValidHex, isExists, getForm, getLabel, getName, getAction, getItemData };
