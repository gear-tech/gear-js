import { useContext } from 'react';
import { TamagotchiCtx } from './ctx-tamagotchi';
import { FTBalanceCtx } from './ctx-ft-balance';
import { BattleCtx } from './ctx-battle';
import { ItemsStoreCtx } from './ctx-ft-store';
import { AppCtx } from './ctx-app';
import { LessonsCtx } from './ctx-lesson';

export const useFTBalance = () => useContext(FTBalanceCtx);
export const useLessons = () => useContext(LessonsCtx);
export const useTamagotchi = () => useContext(TamagotchiCtx);
export const useFTStore = () => useContext(ItemsStoreCtx);
export const useBattle = () => useContext(BattleCtx);
export const useApp = () => useContext(AppCtx);

export { BattleCtx, BattleProvider } from './ctx-battle';
export { TamagotchiCtx, TmgProvider } from './ctx-tamagotchi';
export { FTBalanceCtx, TokensBalanceProvider } from './ctx-ft-balance';
export { ItemsStoreCtx, ItemsStoreProvider } from './ctx-ft-store';
export { AppCtx, AppProvider } from './ctx-app';
export { LessonsCtx, LessonsProvider } from './ctx-lesson';
