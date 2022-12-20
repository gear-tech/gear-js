import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isExists, useForm } from './form';
import { LOCAL_STORAGE } from 'app/consts';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

export { isLoggedIn, isExists, useForm };
