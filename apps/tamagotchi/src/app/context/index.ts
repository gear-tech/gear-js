import { useContext } from 'react';
import { NFTStoreContext } from './nft-store';

export const useNFTStore = () => useContext(NFTStoreContext);
export { TmgContext, TmgProvider } from './tamagotchi';
export { NFTStoreContext, NFTStoreProvider } from './nft-store';
