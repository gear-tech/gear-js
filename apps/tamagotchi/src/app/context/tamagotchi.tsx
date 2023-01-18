import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import type { LessonState } from 'app/types/tamagotchi-state';
import type { TamagotchiState } from 'app/types/lessons';

type Program = {
  lesson?: LessonState;
  setLesson: Dispatch<SetStateAction<LessonState | undefined>>;
  tamagotchi?: TamagotchiState;
  setTamagotchi: Dispatch<SetStateAction<TamagotchiState | undefined>>;
  isDirty: boolean;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
};

export const AppCtx = createContext({} as Program);

const useTmgState = (): Program => {
  const [lesson, setLesson] = useState<LessonState>();
  const [tamagotchi, setTamagotchi] = useState<TamagotchiState>();
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const reset = () => {
    setLesson(undefined);
    setTamagotchi(undefined);
    setIsDirty(false);
  };

  useEffect(() => {
    console.log({ lesson });
  }, [lesson]);

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
    isDirty,
    setIsDirty,
    reset,
  };
};

export function TmgProvider({ children }: { children: ReactNode }) {
  const { Provider } = AppCtx;
  return <Provider value={useTmgState()}>{children}</Provider>;
}
