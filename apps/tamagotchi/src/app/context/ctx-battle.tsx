import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { BattleStateResponse, TamagotchiBattlePlayer } from '../types/battles';

type Program = {
  battleState?: BattleStateResponse;
  setBattleState: Dispatch<SetStateAction<BattleStateResponse | undefined>>;
  players: TamagotchiBattlePlayer[];
  setPlayers: Dispatch<SetStateAction<TamagotchiBattlePlayer[]>>;
};

const useProgram = (): Program => {
  const [players, setPlayers] = useState<TamagotchiBattlePlayer[]>([]);
  const [battleState, setBattleState] = useState<BattleStateResponse>();

  return {
    battleState,
    setBattleState,
    players,
    setPlayers,
  };
};

export const BattleCtx = createContext({} as Program);

export function BattleProvider({ children }: { children: ReactNode }) {
  const { Provider } = BattleCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
