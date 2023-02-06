import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import type { TamagotchiState } from 'app/types/lessons';
import type { StoreItemsNames } from 'app/types/ft-store';

type Program = {
  tamagotchi?: TamagotchiState;
  setTamagotchi: Dispatch<SetStateAction<TamagotchiState | undefined>>;
  tamagotchiItems: StoreItemsNames[];
  setTamagotchiItems: Dispatch<SetStateAction<StoreItemsNames[]>>;
};

export const TamagotchiCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [tamagotchi, setTamagotchi] = useState<TamagotchiState>();
  const [tamagotchiItems, setTamagotchiItems] = useState<StoreItemsNames[]>([]);

  return {
    tamagotchi,
    setTamagotchi,
    tamagotchiItems,
    setTamagotchiItems,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = TamagotchiCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
