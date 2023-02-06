import { useContext } from 'react';
import { LessonsCtx } from './ctx-tamagotchi';
import { TokensBalanceCtx } from './ctx-ft-balance';
import { BattleCtx } from './ctx-battle';
import { ItemsStoreCtx } from './ctx-ft-store';
import { AppCtx } from './ctx-app';

export const useTokensBalanceStore = () => useContext(TokensBalanceCtx);
export const useLesson = () => useContext(LessonsCtx);
export const useFTStore = () => useContext(ItemsStoreCtx);
export const useBattle = () => useContext(BattleCtx);
export const useApp = () => useContext(AppCtx);

export { BattleCtx, BattleProvider } from './ctx-battle';
export { LessonsCtx, TmgProvider } from './ctx-tamagotchi';
export { TokensBalanceCtx, TokensBalanceProvider } from './ctx-ft-balance';
export { ItemsStoreCtx, ItemsStoreProvider } from './ctx-ft-store';
export { AppCtx, AppProvider } from './ctx-app';
