import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from 'consts';
import { getCountdown } from './countdown';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const getNumber = (value: string) => +value.replaceAll(',', '');

const getCountdownNumber = (value: string) => Math.round(getNumber(value) / 1000) * 1000;

export { isLoggedIn, getCountdown, getNumber, getCountdownNumber };
