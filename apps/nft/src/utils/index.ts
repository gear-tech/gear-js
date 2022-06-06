import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ADDRESS, LOCAL_STORAGE } from 'consts';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const getIpfsAddress = (cid: string) => `${ADDRESS.IPFS_GATEWAY}/${cid}`;

export { isLoggedIn, getIpfsAddress };
