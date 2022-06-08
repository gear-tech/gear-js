import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ADDRESS, LOCAL_STORAGE } from 'consts';
import { CID } from 'ipfs-http-client';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const getIpfsAddress = (cid: string) => `${ADDRESS.IPFS_GATEWAY}/${cid}`;

const getMintPayload = (name: string, description: string, jsonCid: CID, imgCid: CID) => {
  const tokenMetadata = {
    name,
    description,
    media: imgCid.toString(),
    reference: jsonCid.toString(),
  };

  return { Mint: { tokenMetadata } };
};

export { isLoggedIn, getIpfsAddress, getMintPayload };
