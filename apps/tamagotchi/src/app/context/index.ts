import { useContext } from 'react';
import { NFTStoreContext } from './nft-store';
import { TamagotchiCtx } from './tamagotchi';

export const useNFTStore = () => useContext(NFTStoreContext);
export const useTamagotchi = () => useContext(TamagotchiCtx);

export { TamagotchiCtx, TmgProvider } from './tamagotchi';
export { NFTStoreContext, NFTStoreProvider } from './nft-store';
