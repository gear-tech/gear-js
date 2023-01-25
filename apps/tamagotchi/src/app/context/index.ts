import { useContext } from 'react';
import { NFTStoreCtx } from './nft-store';
import { LessonsCtx } from './tamagotchi';
import { TokensBalanceCtx } from './token-balance';

export const useTokensBalanceStore = () => useContext(TokensBalanceCtx);
export const useNFTStore = () => useContext(NFTStoreCtx);
export const useLesson = () => useContext(LessonsCtx);

export { LessonsCtx, TmgProvider } from './tamagotchi';
export { TokensBalanceCtx, TokensBalanceProvider } from './token-balance';
export { NFTStoreCtx, NFTStoreProvider } from './nft-store';
