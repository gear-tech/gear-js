import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import type { LessonState } from 'app/types/tamagotchi-state';
import type { TamagotchiState } from 'app/types/lessons';

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  tamagotchi?: TamagotchiState;
  setTamagotchi: Dispatch<SetStateAction<TamagotchiState | undefined>>;
  isConnected: boolean;
  setisConnected: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
};

export const TamagotchiCtx = createContext({} as Program);

const useTmgState = (): Program => {
  const [lesson, setLesson] = useState<LessonState>();
  const [tamagotchi, setTamagotchi] = useState<TamagotchiState>();
  const [isConnected, setisConnected] = useState<boolean>(false);

  const reset = () => {
    setLesson(undefined);
    setTamagotchi(undefined);
    setisConnected(false);
  };

  useEffect(() => {
    const ls = localStorage.getItem('tmgState');
    if (ls) setLesson(JSON.parse(ls));
  }, []);

  useEffect(() => {
    if (lesson) {
      console.log('set?');
      localStorage.setItem('tmgState', JSON.stringify(lesson));
    } else {
      console.log('remove?');
      localStorage.removeItem('tmgState');
    }
  }, [lesson]);

  return {
    lesson,
    setLesson,
    tamagotchi,
    setTamagotchi,
    isConnected,
    setisConnected,
    reset,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = TamagotchiCtx;
  return <Provider value={useTmgState()}>{children}</Provider>;
}
