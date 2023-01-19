import { useContext } from 'react';
import { NFTStoreContext } from './nft-store';
import { LessonsCtx } from './tamagotchi';

export const useNFTStore = () => useContext(NFTStoreContext);
export const useLesson = () => useContext(LessonsCtx);

export { LessonsCtx, TmgProvider } from './tamagotchi';
export { NFTStoreContext, NFTStoreProvider } from './nft-store';
