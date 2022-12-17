import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ADDRESS, LOCAL_STORAGE } from 'consts';
import { getMintDetails, getMintPayload } from './form';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const getIpfsAddress = (cid: string) => `${cid}`; // ${ADDRESS.IPFS_GATEWAY}/

export { isLoggedIn, getIpfsAddress, getMintDetails, getMintPayload };
