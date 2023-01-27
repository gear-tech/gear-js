import { useContext } from 'react';
import { LessonsCtx } from './tamagotchi';
import { TokensBalanceCtx } from './token-balance';

export const useTokensBalanceStore = () => useContext(TokensBalanceCtx);
export const useLesson = () => useContext(LessonsCtx);

export { LessonsCtx, TmgProvider } from './tamagotchi';
export { TokensBalanceCtx, TokensBalanceProvider } from './token-balance';
