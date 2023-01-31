import { useContext } from 'react';
import { LessonsCtx } from './tamagotchi';
import { TokensBalanceCtx } from './token-balance';
import { BattleCtx } from './battle';

export const useTokensBalanceStore = () => useContext(TokensBalanceCtx);
export const useLesson = () => useContext(LessonsCtx);
export const useBattle = () => useContext(BattleCtx);

export { BattleCtx, BattleProvider } from './battle';
export { LessonsCtx, TmgProvider } from './tamagotchi';
export { TokensBalanceCtx, TokensBalanceProvider } from './token-balance';
