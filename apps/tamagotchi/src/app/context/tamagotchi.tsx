import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import type { TmgState } from 'app/types/tamagotchi-state';

type Value = {
  state?: TmgState;
  setState: Dispatch<SetStateAction<TmgState | undefined>>;
};

export const TmgContext = createContext({} as Value);

const useTmgState = (): Value => {
  const [state, setState] = useState<TmgState>();

  useEffect(() => {
    console.log({ state });
  }, [state]);

  useEffect(() => {
    const ls = localStorage.getItem('tmgState');
    if (ls) {
      setState(JSON.parse(ls));
    }
  }, []);

  useEffect(() => {
    if (state) {
      console.log('set?');
      localStorage.setItem('tmgState', JSON.stringify(state));
    } else {
      console.log('remove?');
      localStorage.removeItem('tmgState');
    }
  }, [state]);

  return {
    state,
    setState,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = TmgContext;
  return <Provider value={useTmgState()}>{children}</Provider>;
}
