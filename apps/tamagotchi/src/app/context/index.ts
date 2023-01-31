import { useContext } from 'react';
import { LessonsCtx } from './ctx-tamagotchi';
import { TokensBalanceCtx } from './ctx-ft-balance';
import { BattleCtx } from './ctx-battle';

export const useTokensBalanceStore = () => useContext(TokensBalanceCtx);
export const useLesson = () => useContext(LessonsCtx);
export const useBattle = () => useContext(BattleCtx);

export { BattleCtx, BattleProvider } from './ctx-battle';
export { LessonsCtx, TmgProvider } from './ctx-tamagotchi';
export { TokensBalanceCtx, TokensBalanceProvider } from './ctx-ft-balance';
